/*jshint esversion:6 */

exports.handle = (client) => {
  // Create steps
  const sayHello = client.createStep({
    satisfied() {
      return Boolean(client.getConversationState().helloSent);
    },

    prompt() {
      client.addResponse('welcome');
      client.addResponse('provide/documentation', {
        documentation_link: 'http://docs.init.ai',
      });
      client.addResponse('provide/instructions');

      client.updateConversationState({
        helloSent: true
      });

      client.done();
    }
  });

  const untrained = client.createStep({
    satisfied() {
      return false;
    },

    prompt() {
      client.addResponse('apology/untrained');
      client.done();
    }
  });

  const handleGreeting = client.createStep({
      satisfied() {
        return false;
      },

      prompt() {
        client.addTextResponse('Hello world, I mean human');
        client.done();
      }
  });

  const handleGoodbye = client.createStep({
      satisfied() {
        return false;
      },

      prompt() {
        client.addTextResponse('See you later!');
        client.done();
      }
  });

  const collectCity = client.createStep({
    satisfied() {
      return Boolean(client.getConversationState().weatherCity);
    },

    prompt() {
      // Need to prompt user for city    
      console.log('Need to ask user for city');
      client.done();
    },
  });

  const provideWeather = client.createStep({
    satisfied() {
      return false;
    },

    prompt() {
      // Need to provide weather
      client.done();
    },
  });

  client.runFlow({
    classifications: {
      // map inbound message classifications to names of streams
      goodbye: 'goodbye',
      greeting: 'greeting'
    },
    autoResponses: {
      // configure responses to be automatically sent as predicted by the machine learning model
    },
    streams: {
      goodbye: handleGoodbye,
      greeting: handleGreeting,
      main: 'getWeather',
      onboarding: [sayHello],
      end: [untrained],
      getWeather: [collectCity, provideWeather]
    },
  });
};
