'use strict';
(function () {

   const Result = {
      userData: null,
      resultScore: null,

      init() {
         const url = new URL(location.href);
        this.resultScore =  document.getElementById('result-score');
        this.resultScore.innerText = url.searchParams.get('score') +
            '/' + url.searchParams.get('total');

            this.userData = JSON.parse(sessionStorage.getItem('userData'));
  let userScore = this.userData.userScore;
            if(this.userData && userScore) {
this.resultScore.innerText = userScore.score + '/' + userScore.total;
            }
      }
   }
   Result.init();
})();