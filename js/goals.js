const goalForm =
    document.getElementById("goalForm");

const goalFormWrapper =
    document.getElementById("goalFormWrapper");

const openGoalForm =
    document.getElementById("openGoalForm");

const openGoalFormEmpty =
    document.getElementById("openGoalFormEmpty");

const closeGoalForm =
    document.getElementById("closeGoalForm");

const cancelGoalForm =
    document.getElementById("cancelGoalForm");

const goalsGrid =
    document.getElementById("goalsGrid");

const goalsEmpty =
    document.getElementById("goalsEmpty");

const goalName =
    document.getElementById("goalName");

const goalType =
    document.getElementById("goalType");

const goalTarget =
    document.getElementById("goalTarget");

const goalStartDate =
    document.getElementById("goalStartDate");

const goalEndDate =
    document.getElementById("goalEndDate");

let editingGoalId = null;

const goalDeleteModal =
    document.getElementById("goalDeleteModal");

const deleteGoalName =
    document.getElementById("deleteGoalName");

const cancelGoalDelete =
    document.getElementById("cancelGoalDelete");

const confirmGoalDelete =
    document.getElementById("confirmGoalDelete");

let goalToDeleteId = null;

/* ========================================
   SHOW GOAL FORM
========================================= */

function showGoalForm() {

    goalFormWrapper.style.display = "block";

    goalName.focus();
}


/* ========================================
   HIDE GOAL FORM
========================================= */

function hideGoalForm() {

    goalFormWrapper.style.display = "none";

    goalForm.reset();

    editingGoalId = null;

    document.getElementById("goalFormTitle").textContent =
        "Create goal";
}


/* ========================================
   FORM BUTTONS
========================================= */

if (openGoalForm) {

    openGoalForm.addEventListener(
        "click",
        showGoalForm
    );

}


if (openGoalFormEmpty) {

    openGoalFormEmpty.addEventListener(
        "click",
        showGoalForm
    );

}


if (closeGoalForm) {

    closeGoalForm.addEventListener(
        "click",
        hideGoalForm
    );

}


if (cancelGoalForm) {

    cancelGoalForm.addEventListener(
        "click",
        hideGoalForm
    );

}


/* ========================================
   FORMAT CURRENCY
========================================= */

function formatGoalCurrency(amount) {

    return new Intl.NumberFormat(
        "en-NG",
        {
            style: "currency",
            currency: "NGN",
            maximumFractionDigits: 0
        }
    ).format(amount);

}


/* ========================================
   FORMAT DATE
========================================= */

function formatGoalDate(date) {

    const formattedDate =
        new Date(date + "T00:00:00");

    return formattedDate.toLocaleDateString(
        "en-NG",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );

}


/* ========================================
   CALCULATE GOAL PROGRESS
========================================= */

function calculateGoalProgress(goal) {

    const transactions =
        getTransactions(currentUser.id);

    const goalTransactions =
        transactions.filter(function (transaction) {

            return (
                transaction.date >= goal.startDate &&
                transaction.date <= goal.endDate
            );

        });


    if (goal.type === "revenue") {

        return goalTransactions.reduce(
            function (total, transaction) {

                if (transaction.type === "income") {
                    return total + transaction.amount;
                }

                return total;

            },
            0
        );

    }


    if (goal.type === "profit") {

        let revenue = 0;
        let expenses = 0;

        goalTransactions.forEach(
            function (transaction) {

                if (transaction.type === "income") {

                    revenue += transaction.amount;

                }

                if (transaction.type === "expense") {

                    expenses += transaction.amount;

                }

            }
        );

        return revenue - expenses;

    }


    if (goal.type === "expense") {

        return goalTransactions.reduce(
            function (total, transaction) {

                if (transaction.type === "expense") {
                    return total + transaction.amount;
                }

                return total;

            },
            0
        );

    }


    if (goal.type === "sales") {

        return goalTransactions.reduce(
            function (total, transaction) {

                if (
                    transaction.type === "income" &&
                    transaction.category === "Sales" &&
                    transaction.quantity
                ) {

                    return total + transaction.quantity;

                }

                return total;

            },
            0
        );

    }


    return 0;

}

/* ========================================
   GOAL STATUS
========================================= */

function getGoalStatus(goal, currentValue) {

    const today = new Date();
    const startDate = new Date(
        goal.startDate + "T00:00:00"
    );
    const endDate = new Date(
        goal.endDate + "T00:00:00"
    );

    today.setHours(0, 0, 0, 0);

    /* Expense limit */

    if (goal.type === "expense") {

        if (currentValue > goal.target) {

            return {
                text: "Over Limit",
                className: "over-limit"
            };

        }

        if (today > endDate) {

            return {
                text: "Completed",
                className: "completed"
            };

        }

        if (today < startDate) {

            return {
                text: "Upcoming",
                className: "upcoming"
            };

        }

        return {
            text: "Active",
            className: "active"
        };

    }


    /* Regular goals */

    if (currentValue >= goal.target) {

        return {
            text: "Completed",
            className: "completed"
        };

    }


    if (today > endDate) {

        return {
            text: "Expired",
            className: "expired"
        };

    }


    if (today < startDate) {

        return {
            text: "Upcoming",
            className: "upcoming"
        };

    }


    return {
        text: "Active",
        className: "active"
    };

}


/* ========================================
   GOAL TYPE LABEL
========================================= */

function getGoalTypeLabel(type) {

    if (type === "revenue") {
        return "Revenue";
    }

    if (type === "profit") {
        return "Profit";
    }

    if (type === "expense") {
        return "Expense Limit";
    }

    if (type === "sales") {
        return "Product Sales";
    }

    return "Goal";

}




/* ========================================
   GOAL VALUE FORMAT
========================================= */

function formatGoalValue(
    type,
    value
) {

    if (type === "sales") {

        return `${value.toLocaleString()} units`;

    }

    return formatGoalCurrency(value);

}


/* ========================================
   RENDER GOALS
========================================= */

function renderGoals() {

    if (!currentUser) {
        return;
    }


    const goals =
        getGoals(currentUser.id);


    goalsGrid.innerHTML = "";


    if (goals.length === 0) {

        goalsEmpty.style.display = "block";

        return;

    }


    goalsEmpty.style.display = "none";


    goals.forEach(function (goal) {

        const currentValue =
          calculateGoalProgress(goal);

        const status =
          getGoalStatus(
            goal,
            currentValue
        );


        let progress =
          (currentValue / goal.target) * 100;


        if (progress < 0) {
            progress = 0;
        }


        if (progress > 100) {
            progress = 100;
        }


        const goalCard =
            document.createElement("div");

        goalCard.className = "goal-card";


        goalCard.innerHTML = `

            <div class="goal-card-header">

            <div>

                <h3 class="goal-card-title">
                    ${goal.name}
                </h3>

                <p class="goal-card-type">
                    ${getGoalTypeLabel(goal.type)}
                </p>

            </div>

            <span class="goal-status ${status.className}">
                ${status.text}
            </span>

                <div class="goal-card-menu">

                  <button
                      type="button"
                      class="goal-action-button edit-goal-button"
                      data-id="${goal.id}"
                  >
                      Edit
                  </button>

                  <button
                      type="button"
                      class="goal-action-button delete-goal-button"
                      data-id="${goal.id}"
                  >
                      Delete
                  </button>

 

              </div>

            </div>


            <div class="goal-card-values">

                <span class="goal-current-value">
                    ${formatGoalValue(
                        goal.type,
                        currentValue
                    )}
                </span>

                <span class="goal-target-value">
                    of
                    ${formatGoalValue(
                        goal.type,
                        goal.target
                    )}
                </span>

            </div>


            <div class="goal-progress">

                <div class="goal-progress-track">

                    <div
                        class="goal-progress-bar"
                        style="width: ${progress}%"
                    ></div>

                </div>


                <div class="goal-progress-info">

                    <span>
                        ${Math.round(progress)}% complete
                    </span>

                    <span>
                        Target:
                        ${formatGoalValue(
                            goal.type,
                            goal.target
                        )}
                    </span>

                </div>

            </div>


            <div class="goal-card-dates">

                ${formatGoalDate(goal.startDate)}
                —
                ${formatGoalDate(goal.endDate)}

            </div>

        `;


        goalsGrid.appendChild(goalCard);

    });

    const editGoalButtons =
      document.querySelectorAll(
          ".edit-goal-button"
      );


  editGoalButtons.forEach(function (button) {

      button.addEventListener(
          "click",
          function () {

              const goalId =
                  button.dataset.id;

              openEditGoal(goalId);

          }
      );

  });

  const deleteGoalButtons =
    document.querySelectorAll(
        ".delete-goal-button"
    );


deleteGoalButtons.forEach(function (button) {

    button.addEventListener(
        "click",
        function () {

            const goalId =
                button.dataset.id;

            deleteGoal(goalId);

        }
    );

});

}



/* ========================================
   EDIT GOAL
========================================= */

function openEditGoal(goalId) {

    const goals =
        getGoals(currentUser.id);

    const goal =
        goals.find(function (item) {
            return item.id === goalId;
        });

    if (!goal) {
        return;
    }


    editingGoalId = goalId;


    document.getElementById(
        "goalFormTitle"
    ).textContent = "Edit goal";


    goalName.value =
        goal.name;

    goalType.value =
        goal.type;

    goalTarget.value =
        goal.target;

    goalStartDate.value =
        goal.startDate;

    goalEndDate.value =
        goal.endDate;


    goalFormWrapper.style.display =
        "block";


    goalName.focus();

}

/* ========================================
   SAVE GOAL
========================================= */

if (goalForm) {

    goalForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            if (!currentUser) {

                alert(
                    "Your session could not be found. Please log in again."
                );

                return;

            }


            const name =
                goalName.value.trim();

            const type =
                goalType.value;

            const target =
                Number(goalTarget.value);

            const startDate =
                goalStartDate.value;

            const endDate =
                goalEndDate.value;


            if (
                !name ||
                !type ||
                !target ||
                target <= 0 ||
                !startDate ||
                !endDate
            ) {

                alert(
                    "Please complete all goal fields."
                );

                return;

            }


            if (endDate < startDate) {

                alert(
                    "The end date cannot be before the start date."
                );

                return;

            }


       const goals =
          getGoals(currentUser.id);


      if (editingGoalId) {

          const goalIndex =
              goals.findIndex(
                  function (goal) {
                      return goal.id === editingGoalId;
                  }
              );


          if (goalIndex !== -1) {

              goals[goalIndex] = {

                  id:
                      editingGoalId,

                  name:
                      name,

                  type:
                      type,

                  target:
                      target,

                  startDate:
                      startDate,

                  endDate:
                      endDate

              };

          }

      } else {

          const newGoal = {

              id:
                  Date.now().toString(),

              name:
                  name,

              type:
                  type,

              target:
                  target,

              startDate:
                  startDate,

              endDate:
                  endDate

          };


          goals.unshift(newGoal);

      }


saveGoals(
    currentUser.id,
    goals
);


            hideGoalForm();

            renderGoals();

        }
    );

}


/* ========================================
   INITIALIZE GOALS
========================================= */

renderGoals();


/* ========================================
   DELETE GOAL
========================================= */

function deleteGoal(goalId) {

    const goals =
        getGoals(currentUser.id);

    const goal =
        goals.find(function (item) {

            return item.id === goalId;

        });

    if (!goal) {
        return;
    }


    goalToDeleteId =
        goalId;


    deleteGoalName.textContent =
        goal.name;


    goalDeleteModal.style.display =
        "flex";

}


/* ========================================
   CLOSE DELETE MODAL
========================================= */

function closeGoalDeleteModal() {

    goalDeleteModal.style.display =
        "none";

    goalToDeleteId = null;

}

if (cancelGoalDelete) {

    cancelGoalDelete.addEventListener(
        "click",
        closeGoalDeleteModal
    );

}


if (confirmGoalDelete) {

    confirmGoalDelete.addEventListener(
        "click",
        function () {

            if (!goalToDeleteId) {
                return;
            }


            const goals =
                getGoals(currentUser.id);


            const updatedGoals =
                goals.filter(
                    function (goal) {

                        return goal.id !== goalToDeleteId;

                    }
                );


            saveGoals(
                currentUser.id,
                updatedGoals
            );


            closeGoalDeleteModal();

            renderGoals();

        }
    );

}