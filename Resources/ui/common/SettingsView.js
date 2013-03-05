//SettingsView Component Constructor
var TopLevelView = require('ui/common/components/TopLevelView');
var DatabaseHelper = require('helpers/DatabaseHelper');
var LoginHelper = require('helpers/LoginHelper');
var ButtonView = require('ui/common/components/ButtonView');
var SeparatorView = require('ui/common/components/SeparatorView');
var Palette = require('ui/common/components/Palette');
var ConfirmDialog = require('ui/common/components/ConfirmDialog');
var Measurements = require('ui/common/components/Measurements');

function SettingsView() {
  var topLevelView = new TopLevelView(L('settings_menu'));
  var self = Ti.UI.createView({
    layout : 'vertical',
    top : '120dip'
  });

  topLevelView.add(self);

  var confirmDialog = new ConfirmDialog(L("change_server"), L("change_server_message"), onConfirm = function(e) {
    var server_url = textField.getValue();
    Ti.App.Properties.setString('server_url', server_url);
    DatabaseHelper.clearDatabase();
    LoginHelper.expireSession();
    Ti.App.Properties.setString('email', null);
    Ti.App.Properties.setString('password', null);
    topLevelView.fireEvent('settings_saved');
    Ti.App.fireEvent('settings.refreshSurveys');
  });

  var label = Ti.UI.createLabel({
    top : '20%',
    color : Palette.PRIMARY_COLOR,
    text : L('server_location'),
    left : 5,
    font : { fontSize : Measurements.FONT_MEDIUM }
  });
  self.add(label);
  self.add(new SeparatorView(Palette.SECONDARY_COLOR_LIGHT, Measurements.PADDING_SMALL));

  var textField = Ti.UI.createTextField({
    borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
    color : '#336699',
    right : 5,
    left : 5,
    value : Ti.App.Properties.getString('server_url')
  });
  self.add(textField);

  var saveButton = new ButtonView(L('save'), {
    width : '80%'
  });
  self.add(new SeparatorView(Palette.SECONDARY_COLOR_LIGHT, Measurements.PADDING_SMALL));
  self.add(saveButton);
  saveButton.addEventListener('click', function(e) {
    var server_url = textField.getValue();
    if (server_url.match(/^https?\:\/\/[\w-.]+(\.\w{2,4}|\:\d{2,5})$/i) == null) {
      alert(L("invalid_settings"));
    } else if (Ti.App.Properties.getString('server_url') === server_url) {
      topLevelView.fireEvent('settings_saved');
    } else {
      confirmDialog.show();
    }
  });

  return topLevelView;
}

module.exports = SettingsView;
