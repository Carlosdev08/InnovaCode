document.addEventListener("DOMContentLoaded", () => {
  /* ----------------------------- CONTACT FORM ----------------------------- */
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

    // Eventos para validación en tiempo real
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
           errors.join("<br>"),
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

  /* ---------------------------- BUDGET FORM ---------------------------- */
  const budgetForm = document.getElementById("budget-form");

  if (budgetForm) {
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

      submitBtn.disabled = !isValid;
      return isValid;
    }

    // Escuchar cambios en campos y checkbox
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
          errors.join("<br>"),
          "error"
        );
        return;
      }

      showFormModal(
        "¡Presupuesto enviado!",
        "Gracias por tu solicitud. ✅",
        "success"
      );

      budgetForm.reset();
      submitBtn.disabled = true;
    });
  }
});
//modal de confirmacion o error del envio formulario
function showFormModal(title, message, type = "success") {
  const modal = document.getElementById("formModal");
  const modalTitle = document.getElementById("formModalTitle");
  const modalText = document.getElementById("formModalText");
  const closeBtn = document.querySelector(".form-close");

  modalTitle.textContent = title;
  modalText.innerHTML = message;

  modal.classList.remove("success", "error");
  modal.classList.add(type); // "success" o "error"

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
  }, 3000); // 3 segundos
}
