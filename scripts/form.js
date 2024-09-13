'use script';

(function () {
   const Form = {
      agreeElement: null,
      processElement: null,
      fields: [
         {
            name: 'name',
            id: 'name',
            elem: null,
            regex: /^[А-Я Ё][а-я ё]+\s*$/,
            valid: false,
         },
         {
            name: 'lastName',
            id: 'last-name',
            elem: null,
            regex: /^[А-Я Ё][а-я ё]+\s*$/,
            valid: false,
         },
         {
            name: 'email',
            id: 'email',
            elem: null,
            regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            valid: false,
         },
      ],
      init() {
         const self = this;
         this.fields.forEach(item => {
            item.elem = document.getElementById(item.id);
            item.elem.onchange = function () {
               self.validatefield.call(self, item, this)
            }
         });
         this.processElement = document.getElementById('process');
         this.processElement.onclick = function () {
self.processForm();
         }
         this.agreeElement = document.getElementById('agree');
         this.agreeElement.onchange = function () {
            self.validateForm();
         }
      },
      validatefield(field, elem) {
         if (!elem.value || !elem.value.match(field.regex)) {
            elem.parentNode.style.borderColor = 'red';
            field.valid = false;
         } else {
            elem.parentNode.removeAttribute('style');
            field.valid = true;
         }
         this.validateForm();
      },
      validateForm() {
         const validForm = this.fields.every(item => item.valid);
         const isValid = this.agreeElement.checked && validForm;
         if (isValid) {
            // this.processElement.removeAttribute('disabled');
            this.processElement.disabled = false;
         } else {
            // this.processElement.setAttribute('disabled', value = 'disabled');
            this.processElement.disabled = true;
         }
         return isValid;
      },
processForm() {
if (this.validateForm()) {
   let paramString = '';
   this.fields.forEach(item => {
      paramString += (!paramString ? '?' : '&') + item.name + '=' + item.elem.value;
   })
 
   location.href = 'choice.html' + paramString;
   
}
}
   };
   Form.init();
})(); 

