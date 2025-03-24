document.addEventListener("DOMContentLoaded", () => {
  // ----------------------------- CONTACT FORM -----------------------------
  const contactForm = document.getElementById("contact-form");

  if (contactForm) {
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;

    const nameInput = contactForm.querySelector("#name");
    const surnameInput = contactForm.querySelector("#surname");
    const phoneInput = contactForm.querySelector("#phone");
    const emailInput = contactForm.querySelector("#email");
    const messageInput = contactForm.querySelector("#message");

    const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{1,15}$/;
    const surnameRegex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{1,40}$/;
    const phoneRegex = /^[0-9]{9}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    function validarContacto() {
      const name = nameInput.value.trim();
      const surname = surnameInput.value.trim();
      const phone = phoneInput.value.trim();
      const email = emailInput.value.trim();
      const message = messageInput.value.trim();

      const isValid =
        nameRegex.test(name) &&
        surnameRegex.test(surname) &&
        phoneRegex.test(phone) &&
        emailRegex.test(email) &&
        message.length > 0;

      submitBtn.disabled = !isValid;
      return isValid;
    }

    [nameInput, surnameInput, phoneInput, emailInput, messageInput].forEach(
      (input) => {
        input.addEventListener("input", validarContacto);
      }
    );

    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      if (!validarContacto()) {
        showFormModal(
          "Error en el formulario de contacto",
          "Por favor, revisa los campos.",
          "error"
        );
        return;
      }

      showFormModal(
        "¡Formulario enviado!",
        "Gracias por contactarnos. ✅",
        "success"
      );

      contactForm.reset();
      submitBtn.disabled = true;
    });
  }

  // ---------------------------- BUDGET FORM ----------------------------
  const budgetForm = document.getElementById("budget-form");

  if (!budgetForm) return;

  const termsCheckbox = document.getElementById("terms");
  const submitBtn = budgetForm.querySelector('button[type="submit"]');
  submitBtn.disabled = true;

  const nameInput = budgetForm.querySelector("#name");
  const surnameInput = budgetForm.querySelector("#surname");
  const phoneInput = budgetForm.querySelector("#phone");
  const emailInput = budgetForm.querySelector("#email");
  const serviceInput = budgetForm.querySelector("#service");
  const descriptionInput = budgetForm.querySelector("#description");
  const startDateInput = budgetForm.querySelector("#start-date");
  const budgetInput = budgetForm.querySelector("#budget");
  const clientTypeInput = budgetForm.querySelector("#client-type");
  const urgencyInput = budgetForm.querySelector("#urgency");
  const extrasCheckboxes = document.querySelectorAll(".extra-option");
  const totalPriceDisplay = document.getElementById("totalPrice");

  const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{1,15}$/;
  const surnameRegex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{1,40}$/;
  const phoneRegex = /^[0-9]{9}$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  function validarPresupuesto() {
    const name = nameInput.value.trim();
    const surname = surnameInput.value.trim();
    const phone = phoneInput.value.trim();
    const email = emailInput.value.trim();
    const service = serviceInput.value;
    const description = descriptionInput.value.trim();
    const startDate = startDateInput.value;
    const budget = budgetInput.value.trim();
    const clientType = clientTypeInput.value;
    const urgency = urgencyInput.value;
    const acceptedTerms = termsCheckbox.checked;

    const isValid =
      nameRegex.test(name) &&
      surnameRegex.test(surname) &&
      phoneRegex.test(phone) &&
      emailRegex.test(email) &&
      service !== "" &&
      description.length > 0 &&
      startDate !== "" &&
      budget !== "" &&
      Number(budget) >= 100 &&
      clientType !== "" &&
      urgency !== "" &&
      acceptedTerms;

    calcularTotalSinUrgencia(); // Mostrar un preview del total sin la confirmación de urgencia
    submitBtn.disabled = !isValid;
    return isValid;
  }

  [
    nameInput,
    surnameInput,
    phoneInput,
    emailInput,
    serviceInput,
    descriptionInput,
    startDateInput,
    budgetInput,
    clientTypeInput,
    urgencyInput,
    termsCheckbox,
  ].forEach((input) => {
    input.addEventListener("input", validarPresupuesto);
    input.addEventListener("change", validarPresupuesto);
  });

  budgetForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validarPresupuesto()) {
      showFormModal(
        "Error en el formulario de presupuesto",
        "Revisa los campos del formulario.",
        "error"
      );
      return;
    }

    calcularTotalConUrgencia(() => {
      showFormModal(
        "¡Presupuesto enviado!",
        "Gracias por tu solicitud. ✅",
        "success"
      );
      budgetForm.reset();
      submitBtn.disabled = true;
      calcularTotalSinUrgencia(); // Reseteamos el cálculo
    });
  });

  // ---------------------------- Modal de Urgencia ----------------------------
  const formContainer = document.querySelector(".budget-section");

  function mostrarModalUrgency(message, onConfirm, onCancel) {
    const existingModal = document.querySelector(".modal-custom");
    if (existingModal) {
      existingModal.remove();
    }

    const modal = document.createElement("div");
    modal.classList.add("modal-custom");

    modal.innerHTML = `
      <div class="modal-content-custom">
        <h3>Notificación importante💡</h3>
        <p>${message}</p>
        <div class="modal-btn">
          <button id="confirmUrgencyBtn">Aceptar</button>
          <button id="cancelUrgencyBtn">Cancelar</button>
        </div>
      </div>
    `;

    formContainer.append(modal);

    const confirmBtn = modal.querySelector("#confirmUrgencyBtn");
    const cancelBtn = modal.querySelector("#cancelUrgencyBtn");

    confirmBtn.addEventListener("click", () => {
      onConfirm();
      modal.remove();
    });

    cancelBtn.addEventListener("click", () => {
      if (onCancel) onCancel();
      modal.remove();
    });
  }

  // ---------------------------- Cálculo Total (Preview y Final) ----------------------------
  function calcularBaseTotal() {
    const baseBudget = parseFloat(budgetInput.value) || 0;
    let extrasTotal = 0;

    extrasCheckboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        extrasTotal += parseFloat(checkbox.value);
      }
    });

    return baseBudget + extrasTotal;
  }

  function calcularTotalSinUrgencia() {
    const total = calcularBaseTotal();
    actualizarTotalUI(total);
  }

  function calcularTotalConUrgencia(callback) {
    let total = calcularBaseTotal();
    const urgency = urgencyInput.value;

    if (urgency === "media") {
      mostrarModalUrgency(
        "Se aplicará un incremento del 10% por urgencia media. ¿Confirmas?",
        () => {
          total *= 1.1;
          actualizarTotalUI(total);
          callback();
        },
        () => {
          actualizarTotalUI(total);
        }
      );
      return;
    }

    if (urgency === "alta") {
      mostrarModalUrgency(
        "⚠️ Se aplicará un incremento del 35% por urgencia alta. ¿Confirmas?",
        () => {
          total *= 1.35;
          actualizarTotalUI(total);
          callback();
        },
        () => {
          actualizarTotalUI(total);
        }
      );
      return;
    }

    actualizarTotalUI(total);
    callback();
  }

  function actualizarTotalUI(total) {
    const totalFormateado = total.toLocaleString("es-ES", {
      style: "currency",
      currency: "EUR",
    });

    totalPriceDisplay.textContent = `Total estimado: ${totalFormateado}`;
  }

  // ---------------------------- Listeners para Preview ----------------------------
  budgetInput.addEventListener("input", calcularTotalSinUrgencia);
  urgencyInput.addEventListener("change", calcularTotalSinUrgencia);
  extrasCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", calcularTotalSinUrgencia);
  });
});

// ---------------------------- Modal de Confirmación Formulario ----------------------------
function showFormModal(title, message, type = "success") {
  const modal = document.getElementById("formModal");
  const modalTitle = document.getElementById("formModalTitle");
  const modalText = document.getElementById("formModalText");
  const closeBtn = document.querySelector(".form-close");

  modalTitle.textContent = title;
  modalText.innerHTML = message;

  modal.classList.remove("success", "error");
  modal.classList.add(type);

  modal.style.display = "block";

  closeBtn.onclick = () => {
    modal.style.display = "none";
  };

  window.onclick = (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  };

  setTimeout(() => {
    modal.style.display = "none";
  }, 3000);
}
