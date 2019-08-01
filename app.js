// Storage Controller

// Item Controller
const ItemCtrl = (function(){
    // Item Constructor
    const Item = function(id, name, calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    // Data Structure / State
    const data = {
        items: [
        // {id:0, name: 'Steak Dinner', calories: 1200},
        // {id:1, name: 'Cookie', calories: 400},
        // {id:2, name: 'Eggs', calories: 300}
    ],
        currentItem: null,
        totalCalories: 0
    }

    // Public methods 
    return {
        getItems: function(){
            return data.items;
        },
        logData: function(){
            return data;
        },
        addItem: function(name,calories){
            let ID;
            // Create ID
            if(data.items.length > 0){
                ID = data.items[data.items.length -1].id + 1;
            } else {
                ID = 0;
            }

            // Calories to number
            calories = parseInt(calories);

            // Create new item
            newItem = new Item(ID, name, calories);

            // Add to items array
            data.items.push(newItem);

            return newItem;
        },
        deleteItem: function(id){
            const ids = data.items.map(function(item){
                return item.id;
            });

            // Get index
            const index = ids.indexOf(id);
            data.items.splice(index,1);
        },
        clearAllItems: function(){
            data.items = [];
        },
        getTotalCalories: function(){
            let total = 0;

            // Loop through items and add cals
            $.each(data.items, function(i, item){
                total += item.calories;
            });

            // Set total cal in data structure
            data.totalCalories = total;

            // Return total
            return data.totalCalories;
        },
        getItemById: function(id){
            let found = null;
            // Loop through items
            $.each(data.items, function(i, item){
                if(item.id === id){
                    found = item;
                }
            });
            return found;
        },
        updateItem: function(name, calories){
            // Calories to number
            calories = parseInt(calories);

            let found = null;
            $.each(data.items, function(i, item){
                if(item.id === data.currentItem.id){
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });
            return found;

        },
        setCurrentItem: function(item){
            data.currentItem = item;
        },
        getCurrentItem: function(){
            return data.currentItem;
        }
    }

})();

// UI Controller
const UICtrl = (function(){
    const UISelectors = {
        itemList : '#item-list',
        itemNameInput : '#item-name',
        itemCaloriesInput : '#item-calories',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
        totalCalories: '.total-calories',
    }

    // Public methods
    return{
        populateItemList: function(items){
            let html = '';
            $.each(items, function(i, item){
                html += `<li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                  <i class="fa fa-pencil"></i>
                </a>
              </li>`;
            });

            // Insert list items
            $(UISelectors.itemList).append(html);
        },
        getSelector: function(){
            return UISelectors;
        },
        getItemInput: function(){
            return {
                name:$(UISelectors.itemNameInput).val(),
                calories:$(UISelectors.itemCaloriesInput).val()
            }
        },
        addListItem: function(item){
            // console.log(item); 
            // Show the list
            $(UISelectors.itemList).show(); 
            // Create li element
            let list = `<li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                <i class="edit-item fa fa-pencil"></i>
                </a>
            </li>`;
            // Append to html
            $(UISelectors.itemList).append(list);
        },
        removeItems: function(){
            let lis =$(UISelectors.itemList).children('li');
            console.log(lis);
            $.each(lis, function(i, li){
                $(li).remove();
            });
        },
        hideList: function(){
            $(UISelectors.itemList).hide();
        },
        showTotalCalories: function(totalCalories){
            $(UISelectors.totalCalories).text(totalCalories);
        },
        clearInput: function(){
            $(UISelectors.itemNameInput).val('');
            $(UISelectors.itemCaloriesInput).val('');
        },
        clearEditState: function(){
            UICtrl.clearInput();
            $(UISelectors.updateBtn).hide();
            $(UISelectors.deleteBtn).hide();
            $(UISelectors.backBtn).hide();
            $(UISelectors.addBtn).show();
        },
        showEditState: function(){
            $(UISelectors.updateBtn).show();
            $(UISelectors.deleteBtn).show();
            $(UISelectors.backBtn).show();
            $(UISelectors.addBtn).hide();
        },
        addItemToForm: function() {
            const name = ItemCtrl.getCurrentItem().name;
            const item = ItemCtrl.getCurrentItem().calories;
            $(UISelectors.itemNameInput).val(name);
            $(UISelectors.itemCaloriesInput).val(item);
            UICtrl.showEditState(); 
        },
        updateListItem: function(item) {
            let lis =$(UISelectors.itemList).children('li');
            console.log(lis);
            $.each(lis, function(i, li){
                const listId = $(li).attr('id'); 

                if(listId === `item-${item.id}`){
                    $(li).html(`<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                      <i class="edit-item fa fa-pencil"></i>
                    </a>`);
                }
            });
        },
        deleteListItem: function(id){
            const itemId = `item-${id}`;
            const item = $(`#${itemId}`);
            item.remove();
        }
    }
})();

// App Controller
const App = (function(ItemCtrl, UICtrl){
    // Load event listeners
    const loadEventListeners = function(){
        // Get UI Selectors
        const UISelectors = UICtrl.getSelector();
        // Add item event
        $(UISelectors.addBtn).on('click', itemAddSubmit);
        // Disable submit on enter
        $(document).on('keypress', function(e){
            if(e.keyCode === 13 || e.which === 13){
                e.preventDefault();
                return false;
            }
        })
        // Add icon click event
        $(UISelectors.itemList).on('click', itemEditClick);
        // Update icon click event
        $(UISelectors.updateBtn).on('click', itemUpdateSubmit);
        // Delete icon click event
        $(UISelectors.deleteBtn).on('click', itemDeleteSubmit);
        // Back button click event
        $(UISelectors.backBtn).on('click', itemBackClick);
        // Clear icon click event
        $(UISelectors.clearBtn).on('click', clearAllItemsClick);
    }

    // Add item submit
    const itemAddSubmit = function(e){
        // Get form input from UI Controller
        const input = UICtrl.getItemInput();
        
        // Check for name and calories input
        if(input.name !== '' && input.calories !== ''){
            // Add item
            const newItem = ItemCtrl.addItem(input.name, input.calories);
            // Add item to UI list
            UICtrl.addListItem(newItem);
            // Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            // Add total calories to UI
            UICtrl.showTotalCalories(totalCalories);
            // Clear fields
            UICtrl.clearInput();

        }
        e.preventDefault();
    }

    // Click edit item
    const itemEditClick = function(e){
        e.preventDefault();
        if($(e.target).hasClass('edit-item')){
            // Get list item id (item-0, item-1)
            const listId = $(e.target).parents('.collection-item').attr('id');
            
            // Break into an array
            const listIdArr = listId.split('-');
            
            // Get the actual id
            const id = parseInt(listIdArr[1]);

            // Get item
            const itemToEdit = ItemCtrl.getItemById(id);

            // Set current item
            ItemCtrl.setCurrentItem(itemToEdit);

            // Add item to form
            UICtrl.addItemToForm();
        }
    }

    // Update item submit
    const itemUpdateSubmit = function(e){
        // Get item input
        const input = UICtrl.getItemInput();
        
        // Update item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);
        // Update UI
        UICtrl.updateListItem(updatedItem);

        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        // Add total calories to UI
        UICtrl.showTotalCalories(totalCalories);
        // Clear fields
        UICtrl.clearEditState();

        e.preventDefault();
    }

    // Item Back Click
    const itemBackClick = function(e){
        UICtrl.clearEditState();
        e.preventDefault();
    }

    // Item Delete Click
    const itemDeleteSubmit = function(e){
        // Get current item
        const currentItem = ItemCtrl.getCurrentItem();
        
        // Delete from data structure
        ItemCtrl.deleteItem(currentItem.id);

        // Delete from UI
        UICtrl.deleteListItem(currentItem.id);

        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        // Add total calories to UI
        UICtrl.showTotalCalories(totalCalories);
        // Clear fields
        UICtrl.clearEditState();

        e.preventDefault();
    }

    // Clear Item Click
    const clearAllItemsClick = function(e){
        // Delet all items from data structure
        ItemCtrl.clearAllItems();
        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        // Show total calories on UI
        UICtrl.showTotalCalories(totalCalories);
        // Remove from UI
        UICtrl.removeItems();
        // Hide ul
        UICtrl.hideList();
        
        e.preventDefault();
    }

    // Public methods
    return {
        init: function(){
            // Clear edit state / set initial set
            UICtrl.clearEditState();

            // Fetch items from data structures
            const items = ItemCtrl.getItems();

            // Check if any items
            if(items.length === 0){
                UICtrl.hideList();
            } else {
                // Populate  list with items
                UICtrl.populateItemList(items);
            }

            // Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();

            // Add total calories to UI
            UICtrl.showTotalCalories(totalCalories);

            // Load event listeners
            loadEventListeners();

        }
       
    }
})(ItemCtrl, UICtrl);

// Initialize App
App.init();