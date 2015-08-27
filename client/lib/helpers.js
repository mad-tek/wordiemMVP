if (Meteor.isClient) {
  Template.header.helpers({
    activeIfTemplateIs: function (template) {
      var currentRoute = Router.current().route.getName();
      return currentRoute &&
        template === currentRoute ? 'active' : '';
    }
  });

  Template.layout.transition = function() {
    return function(from, to, element) {
      return 'fade';
    }
  }
}
