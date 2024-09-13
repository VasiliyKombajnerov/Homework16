'use strict';
(function () {

   const Test = {
      quiz: null,
      currentQuestionIndex: 1,
      questionTitleElement: null,
      optionsElement: null,
      nextButtonElement: null,
      previousButtonElement: null,
      passLink: null,
      progressBarElement: null,
      userResult: [],
      isInputChecked: false,

      init() {
         checkUsersData();
         const url = new URL(location.href);
         const testId = url.searchParams.get('id');
         if (testId) {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', 'https://testologia.ru/get-quiz?id=' + testId, false);

            xhr.send();

            if (xhr.status === 200 && xhr.responseText) {
               try {
                  this.quiz = JSON.parse(xhr.responseText);
               } catch (e) {
                  location.href = 'main.html';
               }
               this.startQuiz();

            } else {
               location.href = 'main.html';
            }

         } else {
            location.href = 'main.html';
         }
         // console.log(this.isInputChecked)
      },
      startQuiz() {
         console.log(this.quiz);
         this.progressBarElement = document.getElementById('progress-bar');
         this.questionTitleElement = document.getElementById('title');
         this.optionsElement = document.getElementById('options');
         this.nextButtonElement = document.getElementById('next');
         this.previousButtonElement = document.getElementById('previous');
         this.passLink = document.getElementById('pass');
         (document.getElementById('pre-title')).innerText = this.quiz.name;

         this.nextButtonElement.addEventListener('click', () => {
            this.move('next');
            this.passLink.classList.remove('disabled-link');
            this.isInputChecked = false;
         });


         this.passLink.addEventListener('click', () => {

            this.move('pass');
         })

         this.previousButtonElement.addEventListener('click', () => {
            this.move('prev');
         })
         this.prepareProgressBar();
         this.showQuestion();
         const timerElement = document.getElementById('timer');
         let seconds = 59;
         const self = this;
         const intervalId = setInterval(
            function () {
               seconds--;
               timerElement.innerText = seconds;
               if (seconds === 0) {
                  clearInterval(intervalId);
                  self.complete();
               }
            },
            1000
         )
      },
      prepareProgressBar() {
         for (let i = 0; i < this.quiz.questions.length; i++) {
            const itemElement = document.createElement('div');
            itemElement.className = 'progress-bar-item ' + (i === 0 ? 'active' : '');
            const itemCircleElement = document.createElement('div');
            itemCircleElement.className = 'progress-bar-item-circle';

            const itemTextElement = document.createElement('div');
            itemTextElement.className = 'progress-bar-item-text';
            itemTextElement.innerText = 'Вопрос ' + (i + 1);
            itemElement.appendChild(itemCircleElement);
            itemElement.appendChild(itemTextElement);

            this.progressBarElement.appendChild(itemElement);
         }

      },
      showQuestion() {
         const activeQuestion = this.quiz.questions[this.currentQuestionIndex - 1];//..обект с первым ?
         this.questionTitleElement.innerHTML = `  <span>Вопрос ${this.currentQuestionIndex}:</span> ${activeQuestion.question}`;
         this.optionsElement.innerHTML = '';
         const self = this;
         console.log(this.userResult)
         const choosenOption = this.userResult.find(item => item.questionId === activeQuestion.id);
         activeQuestion.answers.forEach(answer => {

            const optionElement = document.createElement('div');
            optionElement.className = 'test-question-option';

            const inputId = 'answer-' + answer.id;
            const inputElement = document.createElement('input');
            inputElement.className = 'option-answer';
            inputElement.setAttribute('id', inputId);
            inputElement.setAttribute('type', 'radio');
            inputElement.setAttribute('name', 'answer');
            inputElement.setAttribute('value', answer.id);
            if (choosenOption && choosenOption.choosenAnswerId === answer.id) {
               inputElement.setAttribute('checked', 'checked');

            }

            inputElement.addEventListener('change', function () {
               self.chooseAnswer();
               self.passLink.classList.add('disabled-link');
               self.isInputChecked = true;

            });
            const labelElement = document.createElement('label');
            labelElement.setAttribute('for', inputId);
            labelElement.innerHTML = answer.answer;

            optionElement.appendChild(inputElement);
            optionElement.appendChild(labelElement);

            this.optionsElement.appendChild(optionElement);

         });
         if (choosenOption && choosenOption.choosenAnswerId) {
            this.nextButtonElement.disabled = false;
         } else {
            this.nextButtonElement.disabled = true;
         }

         if (this.currentQuestionIndex === this.quiz.questions.length) {
            this.nextButtonElement.innerText = 'Завершить';
         } else {
            this.nextButtonElement.innerText = 'Далее';
         }
         if (this.currentQuestionIndex > 1) {
            this.previousButtonElement.disabled = false;
         } else {
            this.previousButtonElement.disabled = true;
         }

      },
      chooseAnswer() {
         this.nextButtonElement.disabled = false;
      },
      move(action) {

         const activeQuestion = this.quiz.questions[this.currentQuestionIndex - 1];
         let choosenAnswer = Array.from(document.querySelectorAll('.option-answer')).find(element => {
            return element.checked;
         });
         let choosenAnswerId = null;
         if (choosenAnswer && choosenAnswer.value) {
            choosenAnswerId = Number(choosenAnswer.value);
         }

         const existingResult = this.userResult.find(item => {
            return item.questionId === activeQuestion.id
         });
         if (existingResult) {
            existingResult.choosenAnswerId = choosenAnswerId;
         } else {
            this.userResult.push({
               questionId: activeQuestion.id,
               chosenAnswerId: choosenAnswerId
            });
         }


         if (action === 'next' || action === 'pass') {
            this.currentQuestionIndex++;
         } else {
            this.currentQuestionIndex--;
         }

         if (this.currentQuestionIndex > this.quiz.questions.length) {
            this.complete();
            return;
         }
         [...this.progressBarElement.children].forEach((item, index) => {
            const currentItemIndex = index + 1;
            item.classList.remove('complete');
            item.classList.remove('active');
            if (currentItemIndex === this.currentQuestionIndex) {
               item.classList.add('active');
            } else if (currentItemIndex < this.currentQuestionIndex) {
               item.classList.add('complete');
            }

         })

         this.showQuestion()
      },
      complete() {

         const url = new URL(location.href);
         const id = url.searchParams.get('id');
         const name = url.searchParams.get('name');
         const lastName = url.searchParams.get('lastName');
         const email = url.searchParams.get('email');
         const xhr = new XMLHttpRequest();
         xhr.open('POST', 'https://testologia.ru/pass-quiz?id=' + id, false);
         xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
         xhr.send(JSON.stringify({
            name: name,
            lastName: lastName,
            email: email,
            results: this.userResult
         }));
         if (xhr.status === 200 && xhr.responseText) {
            let result = null;
            try {
               result = JSON.parse(xhr.responseText)
            } catch (e) {
               location.href = 'main.html';
            }
            if (result) {
               console.log(result);
               location.href = 'result.html?score=' + result.score + '&total=' + result.total;

            }

         } else {
            location.href = 'main.html';
         }
         //homework16
         sessionStorage.setItem('userData', (JSON.stringify({
            name: name,
            lastName: lastName,
            email: email,
            results: this.userResult,
            id: id
         })));

      }
   }


   Test.init();
})();



