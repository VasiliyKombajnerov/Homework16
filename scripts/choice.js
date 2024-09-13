'use strict';
(function () {
   const Choice = {
      quizzes: [],
      init() {
         checkUsersData();
         const xhr = new XMLHttpRequest();
         xhr.open('GET', 'https://testologia.ru/get-quizzes', false);
         xhr.send();

         if (xhr.status === 200 && xhr.responseText) {
            try {
               this.quizzes = JSON.parse(xhr.responseText)
            } catch (e) {
               location.href = 'main.html';
            }
            this.prossesQuizzes();

         } else {
            location.href = 'main.html';
         }
      },
      prossesQuizzes() {
         console.log(this.quizzes);
         const choiceOptions = document.getElementById('choice-options')
         if (this.quizzes && this.quizzes.length > 0) {
            this.quizzes.forEach(quiz => {
               const self = this;
               const choiceOptionElement = document.createElement('div');
               choiceOptionElement.className = "choice-option";
               choiceOptionElement.setAttribute('data-id', quiz.id);
               choiceOptionElement.addEventListener('click', function(){
self.chooseQuizz(this);
               })

               const choiceOptionTextElement = document.createElement('div');
               choiceOptionTextElement.className = "choice-option-text";
               choiceOptionTextElement.innerHTML = quiz.name;

               const choiceOptionArrowElement = document.createElement('div');
               choiceOptionArrowElement.className = "choice-option-arrow";

               const choiceOptionImageElement = document.createElement('img');
               choiceOptionImageElement.setAttribute('src', './images/arrow.png');
               choiceOptionImageElement.setAttribute('alt', 'стрелка');

               choiceOptionArrowElement.appendChild(choiceOptionImageElement);
               choiceOptionElement.appendChild(choiceOptionTextElement);
               choiceOptionElement.appendChild(choiceOptionArrowElement);

               choiceOptions.appendChild(choiceOptionElement);




            })
         }

      },
      chooseQuizz(elem) {
         const dataId = elem.getAttribute('data-id');
      if(dataId) {
         location.href = 'test.html' + location.search + '&id'+ '=' + dataId;
      }
      }
   }


   Choice.init();
})();