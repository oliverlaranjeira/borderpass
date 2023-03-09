import './App.css';
import Questions from './Components/Questions/Questions'
import user_questions from './Test/sample_questions.json'

const App = () => {
  return <Questions questions={user_questions} />;
};

export default App;
