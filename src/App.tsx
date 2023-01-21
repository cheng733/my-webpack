import './App.css';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Container } from './Container';
/**
 * 
 * 需求：
 * 同一个主题：
 * 上下左右互换
 * 不同主题：
 * 相当于插入一个新的课程
 * 当到一个主题时打开这个主题  -- 还没实现
 * 
 */

function App() {

  return (
    <div className="App">
      <DndProvider backend={HTML5Backend}>
     <Container/>
     </DndProvider>
    </div>
   
  );
}








export default App;
