# Genistudio Configurable Chatbot

## Installation

To install the `@denno1000/genistudio-package`, run the following command in your project directory:

```bash
npm install @denno1000/genistudio-package

or, if you're using Yarn:

yarn add @denno1000/genistudio-package

Usage
After installing the package, you can easily integrate the configurable chatbot into your application by following these steps:

1. Import the ConfigurableChatbot Component
In the file where you want to use the chatbot, import the ConfigurableChatbot component from the package:

javascript
Copy code
import { ConfigurableChatbot } from '@denno1000/genistudio-package';
2. Pass the chatbotId Prop
The ConfigurableChatbot component requires a chatbotId prop, which should be provided when you use the component. The chatbotId uniquely identifies the chatbot configuration you want to use.

3. Add the Component to Your JSX
Place the ConfigurableChatbot component in your JSX code, and pass the chatbotId prop as shown below:

javascript
Copy code
const App = () => {
  return (
    <div>
      <h1>Welcome to Our Platform</h1>
      <ConfigurableChatbot chatbotId="your-chatbot-id-here" />
    </div>
  );
};

export default App;
Replace "your-chatbot-id-here" with the actual ID of the chatbot you wish to configure.

4. Run Your Application
Once you've added the component, start your application, and the chatbot should be integrated seamlessly.

Example
jsx
Copy code
import React from 'react';
import { ConfigurableChatbot } from '@denno1000/genistudio-package';

const App = () => {
  return (
    <div>
      <h1>Our Support Bot</h1>
      <ConfigurableChatbot chatbotId="12345" />
    </div>
  );
};

export default App;
5. Additional Configuration
For more advanced configurations, such as customizing the appearance or behavior of the chatbot, please refer to the advanced section of the documentation (coming soon).