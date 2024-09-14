'use strict';

(function () {

   const CeckAnswers = {
      userData: null,
      preTitleCorrect: null,
      testPersonData: null,
      testOptionsWrapper: null,
      optionsElement: null,
      quiz: null,
      correctAnswers: [],
      init() {
         this.userData = JSON.parse(sessionStorage.getItem('userData'));
         if (this.userData) {
            console.log(this.userData);

            const xhr = new XMLHttpRequest();
            xhr.open('GET', 'https://testologia.ru/get-quiz?id=' + this.userData.id, false);
            xhr.send();
            if (xhr.status === 200 && xhr.responseText) {
               try {
                  this.quiz = JSON.parse(xhr.responseText);
               } catch (e) {
                  location.href = 'index.html';
               }
            } else {
               location.href = 'index.html';
            }
         } else {
            location.href = 'index.html';
         }
         this.getCorrectAnswers();
         this.showDataTestComplete();
      },
      showDataTestComplete() {

         this.preTitleCorrect = document.getElementById('pre-title-correct');
         const preTitleText = this.preTitleCorrect.querySelector('span');
         this.testPersonData = document.querySelector('.test-person-data');
         const testPersonDataText = this.testPersonData.querySelector('span');
         this.testOptionsWrapper = document.querySelector('.test-options-wrapper');
         this.testOptionsWrapper.innerHTML = '';
         preTitleText.innerHTML = `${this.quiz.name}`;
         testPersonDataText.innerHTML = `${this.userData.name} ${this.userData.lastName} ${this.userData.email}`;
         const questionsComplete = this.quiz.questions;

         questionsComplete.forEach((question, index) => {
            const questionBlock = document.createElement('div');
            questionBlock.className = 'test-question';
            const testQuestionTitle = document.createElement('div');
            testQuestionTitle.className = 'test-question-title';
            testQuestionTitle.innerHTML = `<span>Вопрос ${index + 1}:</span> ${question.question}`;
            const tesQuestionOptions = document.createElement('div');
            tesQuestionOptions.className = 'test-question-options ';
            //   ..блок для радиокнопок
            //иттерация по массиву answers
            question.answers.forEach(answer => {

               const optionElement = document.createElement('div');
               optionElement.className = 'test-question-option';

               const inputId = 'answer-' + answer.id;
               const inputElement = document.createElement('input');
               inputElement.className = 'option-answer';
               inputElement.setAttribute('id', inputId);
               inputElement.setAttribute('type', 'radio');
               inputElement.setAttribute('value', answer.id);
               inputElement.setAttribute('disabled', true);

               this.userData.results.forEach(result => {
                  if (result.questionId === question.id && result.chosenAnswerId === answer.id) {
                     inputElement.checked = true;

                     if (this.correctAnswers.includes(answer.id)) {
                        optionElement.style.color = '#5FDC33';
                        inputElement.style.borderColor = '#5FDC33';
                        inputElement.classList.add('correct');
                     } else {
                        optionElement.style.color = '#DC3333';
                        inputElement.style.borderColor = '#DC3333';
                        inputElement.classList.add('error');
                     }
                  }
               });

               const labelElement = document.createElement('label');
               labelElement.setAttribute('for', inputId);
               labelElement.innerHTML = answer.answer;

               optionElement.appendChild(inputElement);
               optionElement.appendChild(labelElement);
               tesQuestionOptions.appendChild(optionElement);
            })
            questionBlock.appendChild(testQuestionTitle);
            questionBlock.appendChild(tesQuestionOptions);
            this.testOptionsWrapper.appendChild(questionBlock);
         });
      },
      getCorrectAnswers() {
         if (this.userData.id) {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', 'https://testologia.ru/get-quiz-right?id=' + this.userData.id, false);
            xhr.send();
            if (xhr.status === 200 && xhr.responseText) {
               try {
                  this.correctAnswers = JSON.parse(xhr.responseText);
               } catch (e) {
                  location.href = 'index.html';
               }
            }
         } else {
            location.href = 'index.html'
         }
      }
   }
   CeckAnswers.init();
})();
