let habits = [];

const nameInput = document.getElementById("habit-name");
const targetInput = document.getElementById("habit-target");
const categoryInput = document.getElementById("habit-category");
const errorMsg = document.getElementById("error-message");
const habitList = document.getElementById("habit-list");
const addBtn = document.getElementById("add-button");

const totalCountEl = document.getElementById("total-count");
const doneCountEl = document.getElementById("done-count");
const pctEl = document.getElementById("pct");

function validateForm() {
  if (nameInput.value.trim().length < 3) {
    showError("Habit name must be at least 3 characters.");
    return null;
  }
  const target = Number(targetInput.value);
  if (!targetInput.value || !Number.isInteger(target) || target < 1 || target > 7) {
    showError("Target must be a whole number between 1 and 7.");
    return null;
  }
  if (!categoryInput.value) {
    showError("Category is required.");
    return null;
  }
  return {
    name: nameInput.value.trim(),
    target: target,
    category: categoryInput.value
  };
}

function showError(message) {
  errorMsg.textContent = message;
  errorMsg.classList.add("visible");
}

function clearError() {
  errorMsg.textContent = "";
  errorMsg.classList.remove("visible");
}

function addHabit() {
  const formData = validateForm();
  if (formData === null) return;

  clearError();

  const habit = {
    id: Date.now(),
    name: formData.name,
    target: formData.target,
    category: formData.category,
    streak: 0,
    doneToday: false
  };

  habits.push(habit);

  nameInput.value = "";
  targetInput.value = "";
  categoryInput.value = "";

  renderHabits();
}

function renderHabits() {
  habitList.innerHTML = "";

  if (habits.length === 0) {
    const msg = document.createElement("p");
    msg.className = "empty-message";
    msg.textContent = "No habits yet. Add one above!";
    habitList.appendChild(msg);
    updateSummary();
    return;
  }

  habits.forEach(function(h) {
    let streakText;
    if (h.streak === 0) {
      streakText = "No streak yet";
    } else if (h.streak === 1) {
      streakText = "1 day streak";
    } else {
      streakText = h.streak + " day streak";
    }

    const item = document.createElement("div");
    item.className = h.doneToday ? "habit-item done-today" : "habit-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = h.doneToday;

    const info = document.createElement("div");
    info.className = "habit-information";
    info.innerHTML =
      "<div class='habit-name'>" + h.name + "</div>" +
      "<div class='habit-meta'>" +
        "<span class='cat-badge cat-" + h.category + "'>" + h.category + "</span>" +
        h.target + "x/week" +
      "</div>";

    const streak = document.createElement("div");
    streak.className = "streak";
    streak.textContent = streakText;

    const delBtn = document.createElement("button");
    delBtn.className = "button-delete";
    delBtn.textContent = "×";

    checkbox.addEventListener("change", function() {
      toggleDone(h.id);
    });

    delBtn.addEventListener("click", function() {
      deleteHabit(h.id);
    });

    item.appendChild(checkbox);
    item.appendChild(info);
    item.appendChild(streak);
    item.appendChild(delBtn);

    habitList.appendChild(item);
  });

  updateSummary();
}

function toggleDone(id) {
  for (let i = 0; i < habits.length; i++) {
    if (habits[i].id === id) {
      if (!habits[i].doneToday) {
        habits[i].doneToday = true;
        habits[i].streak += 1;
      } else {
        habits[i].doneToday = false;
        if (habits[i].streak > 0) {
          habits[i].streak -= 1;
        }
      }
      break;
    }
  }
  renderHabits();
}

function deleteHabit(id) {
  habits = habits.filter(function(h) {
    return h.id !== id;
  });
  renderHabits();
}

function updateSummary() {
  const total = habits.length;
  let done = 0;

  habits.forEalch(function(h) {
    if (h.doneToday) done++;
  });

  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  totalCountEl.textContent = total;
  doneCountEl.textContent = done;
  pctEl.textContent = pct + "%";
}

addBtn.addEventListener("click", addHabit);

document.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    addHabit();
  }
});

renderHabits();