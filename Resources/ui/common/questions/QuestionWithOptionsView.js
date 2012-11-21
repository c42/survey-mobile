//QuestionWithOptionsView Component Constructor
var _ = require('lib/underscore')._;
var Option = require('models/option');
var Response = require('models/response');

function QuestionWithOptionsView(question, answer) {
  var content = answer ? answer.content : null;
  var response = answer ? Response.findOneById(answer.response_id) : null;
  var view_height = 400;
  var self = Ti.UI.createView({
    layout : 'vertical',
    height : Titanium.UI.SIZE
  });

  var button = Ti.UI.createButton({
    title : "None",
    width : '80%'
  });
  self.add(button);

  var data = [];
  var selectedIndex = 0;

  var options = question.options();
  options.unshift({ content: "None" });
  var optionTitles = options.map(function(option){ return option.content; });
  

  button.addEventListener('click', function() {
    
    var optionsDialog = Ti.UI.createOptionDialog({
      options : optionTitles,
      selectedIndex : content ? optionTitles.indexOf(content) : selectedIndex,
      title : question.content
    });
    
    if(content) {
      showSubQuestions(optionTitles.indexOf(content));
    }
    
    optionsDialog.addEventListener('click', function(e){
      selectedIndex = e.index;      
      button.setTitle(optionTitles[selectedIndex]);
      showSubQuestions(selectedIndex);
    })
    
    optionsDialog.show();
  });

  var showSubQuestions = function(selectedRowID) {
    var optionID = options[selectedRowID].id;
    var option = Option.findOneById(optionID);
    Ti.API.info("Showing sub questions for" + option.content);
    _(self.getChildren()).each(function(childView) {
      if (childView != button)
        self.remove(childView);
    });
    var QuestionView = require('ui/common/questions/QuestionView');
    var subQuestions = option.firstLevelSubQuestions();
    _(subQuestions).each(function(subQuestion) {
      var subQuestionAnswer = response ? response.answerForQuestion(subQuestion.id) : null;
      self.add(new QuestionView(subQuestion, subQuestionAnswer));
    });
  };

  self.getValue = function() {
    if (selectedIndex == 0){
      return '';
    } else {
      return optionsTitles[selectedIndex];
    }
  };

  return self;
}

module.exports = QuestionWithOptionsView;
