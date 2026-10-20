/* =========================================
   PET TRACK - MY PETS
========================================= */

import { db, auth } from "../js/firebase.js";

import {
    collection,
    addDoc,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


/* =========================================
   ELEMENTS
========================================= */

const addPetBtn =
    document.getElementById("addPetBtn");

const addCategoryTab =
    document.getElementById("addCategoryTab");

const emptyAddBtn =
    document.getElementById("emptyAddBtn");

const categoryModal =
    document.getElementById("categoryModal");

const closeModal =
    document.getElementById("closeModal");

const cancelBtn =
    document.getElementById("cancelBtn");

const categoryForm =
    document.getElementById("categoryForm");

const categoryName =
    document.getElementById("categoryName");

const categoryType =
    document.getElementById("categoryType");

const categoryNav =
    document.getElementById("categoryNav");

const emptyState =
    document.getElementById("emptyState");

const categoryContent =
    document.getElementById("categoryContent");

const selectedCategoryTitle =
    document.getElementById(
        "selectedCategoryTitle"
    );

const selectedCategoryDescription =
    document.getElementById(
        "selectedCategoryDescription"
    );

const menuBtn =
    document.getElementById("menuBtn");

const sidebar =
    document.querySelector(".sidebar");


/* =========================================
   SELECTED ICON
========================================= */

let selectedIcon = "🐦";


/* =========================================
   CATEGORIES
========================================= */

let categories = [];


/* =========================================
   OPEN CATEGORY MODAL
========================================= */

function openCategoryModal() {

    categoryModal.classList.add("show");

    categoryName.focus();

}


/* =========================================
   CLOSE CATEGORY MODAL
========================================= */

function closeCategoryModal() {

    categoryModal.classList.remove("show");

    categoryForm.reset();

    selectedIcon = "🐦";


    document
        .querySelectorAll(".icon-option")
        .forEach(button => {

            button.classList.remove(
                "selected"
            );

        });


    const defaultIcon =
        document.querySelector(
            '.icon-option[data-icon="🐦"]'
        );


    if (defaultIcon) {

        defaultIcon.classList.add(
            "selected"
        );

    }

}


/* =========================================
   CATEGORY BUTTONS
========================================= */

addCategoryTab.addEventListener(
    "click",
    openCategoryModal
);


emptyAddBtn.addEventListener(
    "click",
    openCategoryModal
);


closeModal.addEventListener(
    "click",
    closeCategoryModal
);


cancelBtn.addEventListener(
    "click",
    closeCategoryModal
);


/* =========================================
   CLICK OUTSIDE MODAL
========================================= */

categoryModal.addEventListener(
    "click",
    function(event) {

        if (
            event.target ===
            categoryModal
        ) {

            closeCategoryModal();

        }

    }
);


/* =========================================
   ICON SELECTION
========================================= */

document
    .querySelectorAll(".icon-option")
    .forEach(button => {

        button.addEventListener(
            "click",
            function() {

                document
                    .querySelectorAll(
                        ".icon-option"
                    )
                    .forEach(btn => {

                        btn.classList.remove(
                            "selected"
                        );

                    });


                this.classList.add(
                    "selected"
                );


                selectedIcon =
                    this.dataset.icon;

            }
        );

    });


/* =========================================
   LOAD CATEGORIES FROM FIRESTORE
========================================= */

async function loadCategories() {

    try {

        const user = auth.currentUser;


        if (!user) {

            console.log(
                "No logged-in user."
            );

            categories = [];

            renderCategories();

            return;

        }


        const categoriesRef =
            collection(
                db,
                "users",
                user.uid,
                "categories"
            );


        const snapshot =
            await getDocs(
                categoriesRef
            );


        categories = [];


        snapshot.forEach(
            document => {

                categories.push({

                    id: document.id,

                    ...document.data()

                });

            }
        );


        renderCategories();


        console.log(
            "Categories loaded:",
            categories
        );

    } catch (error) {

        console.error(
            "Error loading categories:",
            error
        );

        alert(
            "Unable to load your pet categories."
        );

    }

}


/* =========================================
   ADD CATEGORY
========================================= */

categoryForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const name =
            categoryName.value.trim();

        const type =
            categoryType.value;


        /* Check fields */

        if (!name || !type) {

            alert(
                "Please complete all fields."
            );

            return;

        }


        /* Check logged-in user */

        const user =
            auth.currentUser;


        if (!user) {

            alert(
                "You must be logged in to create a category."
            );

            return;

        }


        /* Check duplicate category */

        const alreadyExists =
            categories.some(
                category =>
                    category.name
                        .toLowerCase() ===
                    name.toLowerCase()
            );


        if (alreadyExists) {

            alert(
                "A category with this name already exists."
            );

            return;

        }


        /* Create category */

        const newCategory = {

            name: name,

            type: type,

            icon: selectedIcon,

            petCount: 0

        };


        try {

            /* Save to Firestore */

            const categoriesRef =
                collection(
                    db,
                    "users",
                    user.uid,
                    "categories"
                );


            const documentReference =
                await addDoc(
                    categoriesRef,
                    newCategory
                );


            /* Add Firestore ID */

            const savedCategory = {

                id: documentReference.id,

                ...newCategory

            };


            categories.push(
                savedCategory
            );


            /* Update interface */

            renderCategories();


            /* Close modal */

            closeCategoryModal();


            /* Select newly created category */

            selectCategory(
                savedCategory.id
            );


            console.log(
                "Category saved:",
                savedCategory
            );


        } catch (error) {

            console.error(
                "Error saving category:",
                error
            );

            alert(
                "Unable to save the category. Please try again."
            );

        }

    }
);


/* =========================================
   RENDER CATEGORIES
========================================= */

function renderCategories() {

    /* Remove previously generated
       category buttons */

    categoryNav
        .querySelectorAll(
            ".dynamic-category"
        )
        .forEach(button => {

            button.remove();

        });


    /* Create category buttons */

    categories.forEach(
        category => {

            const button =
                document.createElement(
                    "button"
                );


            button.className =
                "category-tab dynamic-category";


            button.dataset.category =
                category.id;


            button.innerHTML = `
                <span>${category.icon}</span>
                ${category.name}
            `;


            button.addEventListener(
                "click",
                function() {

                    selectCategory(
                        category.id
                    );

                }
            );


            /* Put category before
               Add Category button */

            categoryNav.insertBefore(
                button,
                addCategoryTab
            );

        }
    );


    updateInitialState();

}


/* =========================================
   INITIAL STATE
========================================= */

function updateInitialState() {

    if (categories.length === 0) {

        emptyState.classList.remove(
            "hidden"
        );

        categoryContent.classList.add(
            "hidden"
        );

    } else {

        emptyState.classList.add(
            "hidden"
        );

        categoryContent.classList.remove(
            "hidden"
        );

    }

}


/* =========================================
   SELECT CATEGORY
========================================= */

function selectCategory(
    categoryId
) {

    /* Remove active state */

    document
        .querySelectorAll(
            ".category-tab"
        )
        .forEach(button => {

            button.classList.remove(
                "active"
            );

        });


    /* ALL */

    if (categoryId === "all") {

        const allButton =
            document.querySelector(
                '[data-category="all"]'
            );


        if (allButton) {

            allButton.classList.add(
                "active"
            );

        }


        selectedCategoryTitle.textContent =
            "All Pets";


        selectedCategoryDescription.textContent =
            "All your registered pets";


        return;

    }


    /* Selected category */

    const selectedButton =
        document.querySelector(
            `[data-category="${categoryId}"]`
        );


    if (selectedButton) {

        selectedButton.classList.add(
            "active"
        );

    }


    /* Find category */

    const category =
        categories.find(
            item =>
                String(item.id) ===
                String(categoryId)
        );


    if (!category) {

        return;

    }


    selectedCategoryTitle.textContent =
        category.name;


    selectedCategoryDescription.textContent =
        `${category.type} • ${category.petCount} pets`;

}


/* =========================================
   ALL PETS BUTTON
========================================= */

const allButton =
    document.querySelector(
        '[data-category="all"]'
    );


if (allButton) {

    allButton.addEventListener(
        "click",
        function() {

            selectCategory("all");

        }
    );

}


/* =========================================
   ADD PET
========================================= */

addPetBtn.addEventListener(
    "click",
    function() {

        if (categories.length === 0) {

            alert(
                "Please create a pet category first."
            );

            openCategoryModal();

            return;

        }


        alert(
            "Add Pet form coming next!"
        );

    }
);


/* =========================================
   MOBILE MENU
========================================= */

menuBtn.addEventListener(
    "click",
    function() {

        sidebar.classList.toggle(
            "open"
        );

    }
);


/* =========================================
   START PAGE
========================================= */

auth.onAuthStateChanged(
    function(user) {

        if (user) {

            loadCategories();

        } else {

            categories = [];

            renderCategories();

        }

    }
);