//       BUDGET CONTROLLER       // // Test comment // 

var budgetController = (function() {
    
            var Expense = function( id, value, description ) {
                this.id = id;
                this.value = value;
                this.description = description;
                this.percentage = -1;
             };
            
            Expense.prototype.calcPercentage = function(totalIncome) {
                
                if ( totalIncome > 0 ) {
                    this.percentage = Math.round((this.value/totalIncome) * 100);
                }
                else {
                    this.percentage = -1;
                }
            };
    
            Expense.prototype.getPercentage = function() {
            
                return this.percentage;
            
            
            };        
    
            var Income = function( id, value, description ) {
                this.id = id;
                this.value = value;
                this.description = description;
            };

            var calcTotal = function(type) {
                var sum = 0;
                data.allItem[type].forEach( function(cur) {
                    sum += cur.value ;
                });
                data.totalItem[type] = sum;
            };

            var data = {
                allItem : {
                    inc: [],
                    exp: []
                },
                totalItem : {
                    inc: 0,
                    exp: 0
                },
                budget: 0,
                percentage: -1
            };

            return {
                addItem : function( type, value, descr ) {                    
                    var newItem, ID;

                    // [1 2 3 4 5]
                    // [1 2 4 6 8]

                    // Create New Id
                    if ( data.allItem[type].length > 0 ) {
                    ID = data.allItem[type][data.allItem[type].length - 1].id + 1;
                    }

                    else {
                        ID = 0;
                    }

                    // Create a new object/item based on the type
                    if ( type === 'exp' ) {
                    newItem = new Expense( ID, value, descr );
                    }
                    else if ( type === 'inc' ) {
                    newItem = new Income( ID, value, descr );
                    }

                    // Push the new object/item into our data structure
                    data.allItem[type].push(newItem);

                    // Return the new item
                    return newItem;

                },

                deleteItem : function( type, id ) {
                    var ids, index;

                    ids = data.allItem[type].map(function(current) {
                        return current.id;
                    });

                    index = ids.indexOf(id);

                    if ( index !== -1 ) {
                    data.allItem[type].splice(index, 1);
                    }
                },

                budgetCalc : function() {

                    // 1. Calculate the total income and expenses.
                        calcTotal('inc');
                        calcTotal('exp');

                    // 2. Calculate the budget ( income - expenses ).

                        data.budget = data.totalItem.inc - data.totalItem.exp;

                    // 3. Calculate the percentage of income we spent.
                        if ( data.totalItem.inc > 0 ) {
                        data.percentage = Math.round((data.totalItem.exp/data.totalItem.inc) *100);
                        }
                        else {
                            data.percentage = -1;
                        }    
                },
                    
                calcPercentages : function() {
                    
                    data.allItem.exp.forEach( function(cur) {
                        
                        cur.calcPercentage(data.totalItem.inc);
                    
                    });
                },
                    
                getPercentages : function() {
                    
                    var allPerc = data.allItem.exp.map( function(cur) {
                    
                        return cur.getPercentage();
                    
                    });
                    return allPerc;
                },

                returnVal : function() {
                    return {
                        budget : data.budget,
                        totalIncome : data.totalItem.inc,
                        totalExpense : data.totalItem.exp,
                        percentage : data.percentage
                    };

                },

                testing : function() {
                    console.log(data);
                }
};
                        
})();




//      UI CONTROLLER      //

var UIController = (function() {
    
    var DOMStrings = {
        inputType : '.add__type',
        inputDescription : '.add__description',
        inputValue : '.add__value',
        inputButton : '.add__btn',
        incomeContainer : '.income__list',
        expenseContainer : '.expenses__list',
        budgetLabel : '.budget__value',
        incomeLabel : '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel : '.budget__expenses--percentage',
        ieContainer : '.container',
        percLabel : '.item__percentage',
        monthLabel : '.budget__title--month'
    };
    
    var formatNumber = function( num, type ) {
        
        var numSplit, int, dec; 
        
        num = Math.abs(num);
        num = num.toFixed(2);
        
        numSplit = num.split('.');
        int = numSplit[0];
        dec = numSplit[1];
        
        if ( int.length > 3 ) {
        
            int = int.substr( 0, int.length - 3 ) + ',' + num.substr( int.length - 3, 3 );
        
        }
        
        return ( type === 'exp' ? '-' : '+' ) + ' ' + int + '.' + dec; 
    
    };
    
    var nodeListForEach = function( list, callback ) {
            for ( var i = 0; i < list.length; i++ ) {
                callback( list[i], i );
            }
    };
    
    return {
                getInput : function() {
                   return {
                       type : document.querySelector(DOMStrings.inputType).value, // input can be inc or exp // //".value" is a method to select field value not the value used in our js//
                       description : document.querySelector(DOMStrings.inputDescription).value,
                       value : parseFloat(document.querySelector(DOMStrings.inputValue).value)
                   };
               },
        
               addUi : function( obj, type ) {
                    
                   var html, newHtml, element;
                   
                   // Create an html string with placeholder text.
                   if ( type === 'inc' ) {
                       element = DOMStrings.incomeContainer;

                       html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';   
                       }
                   
                   else if ( type === 'exp' ) {
                       element = DOMStrings.expenseContainer;       

                       html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';  
                       }
                   
                   // Replace the placeholder text with actual data.
                   newHtml = html.replace( '%id%', obj.id ); 
                   newHtml = newHtml.replace( '%description%', obj.description ); 
                   newHtml = newHtml.replace( '%value%', formatNumber(obj.value, type) ); 
                   
                   // Put the html in the DOM.
                   document.querySelector(element).insertAdjacentHTML( 'beforeend', newHtml );
                   
               },
        
               removeUi : function(selId) {
                    var el = document.getElementById(selId);
                    el.parentNode.removeChild(el);
              
               },
        
               clearAllfields : function() {
                    var fields, fieldArr;        
                    
                    fields = document.querySelectorAll( DOMStrings.inputDescription + ', ' + DOMStrings.inputValue );
                    
                    fieldArr = Array.prototype.slice.call(fields);
                    
                    fieldArr.forEach(function( val, index, arr ) {
                            val.value = "";     // Why is this val.value??
                    });
                   fieldArr[0].focus();
    
               },
        
               displayBudget : function(obj) {
                    var type;
                    obj.budget > 0 ? type = 'inc' : type = 'exp';
                   
                    document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber( obj.budget, type );
                    document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber( obj.totalIncome, 'inc');
                    document.querySelector(DOMStrings.expenseLabel).textContent = formatNumber( obj.totalExpense, 'exp');
                   
                   if ( obj.percentage >0) {
                    document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage +'%';
                   }
                   else {
                    document.querySelector(DOMStrings.percentageLabel).textContent = '---';
                   }
                   
               },
        
               displayPercentage : function(percentages) {
                    
                   var fields = document.querySelectorAll(DOMStrings.percLabel);
                   
                   nodeListForEach( fields, function(current, index) {
                        if ( percentages[index] > 0 ) {
                        current.textContent = percentages[index] + '%';
                        } else {
                        current.textContent = '---';
                        }
                   });
                
               },
        
               displayMonth : function() {
                
                   var present, months, month, year;
                   
                   present = new Date();
                   
                   months = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                   month = present.getMonth();
               
                   year = present.getFullYear();
                   
                   document.querySelector(DOMStrings.monthLabel).textContent = months[month] + ' ' + year;
                   
                   
               },
        
               changeType : function() {
               
                   var fields = document.querySelectorAll(
                        DOMStrings.inputType + ',' +    
                        DOMStrings.inputDescription + ',' +
                        DOMStrings.inputValue);
                   
                   nodeListForEach( fields, function(cur) {
                        
                        cur.classList.toggle('red-focus');
                   
                   });
                   
                   document.querySelector(DOMStrings.inputButton).classList.toggle('red');
               
               },
        
               getDOMStrings : function() {
                    
                return DOMStrings;
               
               }
           };

})();




//      GLOBAL APP CONTROLLER    //

var controller = (function( budgetCtrl, UICtrl ) {
    
            var getEventListeners = function() {

                var takeDOMStrings = UICtrl.getDOMStrings();

                document.querySelector(takeDOMStrings.inputButton).addEventListener( 'click', ctrlAddItem );

                document.addEventListener('keypress', function(event) {

                if ( event.keycode === 13 || event.which === 13 ) {
                    ctrlAddItem();
                }

            });
                document.querySelector(takeDOMStrings.ieContainer).addEventListener('click', ctrlDeleteItem);
                document.querySelector(takeDOMStrings.inputType).addEventListener('change', UICtrl.changeType);

        };

            var updateBudget = function () {

                // 1. Calculate the budget.
                    budgetCtrl.budgetCalc();

                // 2. Return the budget.
                    var budgets = budgetCtrl.returnVal();

                // 3. Update the UI.
                    UICtrl.displayBudget(budgets);

            };

            var updatePercentage = function() {


                // 1. Calculate the budget.
                    budgetCtrl.calcPercentages();


                // 2. Read percentage from the budget controller.
                    var perc = budgetCtrl.getPercentages();


                // 3. Update the UI with the new percentages.
                    UICtrl.displayPercentage(perc);

            }

            var ctrlAddItem = function() {
                   var getUiFieldValue, newItem;
                // 1. Get input values from the field.

                   getUiFieldValue = UICtrl.getInput();

                   if ( getUiFieldValue.description !== "" && !isNaN( getUiFieldValue.value ) && getUiFieldValue.value > 0 ) {
                // 2. Add the value to the budget controller.
                   newItem = budgetCtrl.addItem( getUiFieldValue.type, getUiFieldValue.value, getUiFieldValue.description );

                // 3. Add the value/item to the UI.
                   UICtrl.addUi( newItem, getUiFieldValue.type );

                // 4.Clear the input fields.
                   UICtrl.clearAllfields();

                // 5. Calculate and update the UI.
                   updateBudget();
                   }

                // 6. Calculate the update percentages.
                   updatePercentage();

             };

             var ctrlDeleteItem = function(event) {

                 var itemId, splitId, type, ID;

                 itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;

                 if (itemId) {

                     console.log(itemId);

                     splitId = itemId.split('-');
                     type = splitId[0];
                     ID = parseInt(splitId[1]);

                     // 1. Delete the item from our data structure.
                     budgetCtrl.deleteItem( type, ID );

                     // 2. Delete the item from our UI.
                     UICtrl.removeUi(itemId);

                     // 3. Update and show the new Budget.
                     updateBudget();

                     // 4. Calculate the update percentages.
                     updatePercentage();
                 }
             };

             return {
                init : function() {
                    UICtrl.displayMonth();
                    UICtrl.displayBudget({
                    budget : 0,
                    totalIncome : 0,
                    totalExpense : 0,
                    percentage : 0
                    });
                    getEventListeners();
                }
            };
    
    
})(budgetController, UIController);


controller.init();






