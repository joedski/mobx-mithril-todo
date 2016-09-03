
import m from 'mithril';
import store from './store';
import className from 'classnames';
import Todo from './components/Todo';



// Should log things.
store.addTodo( "Start Learning MobX" );
store.addTodo( "Things" );
store.todos[ 0 ].completed = true;
store.addTodo( "Determine if MobX is necessary like this with Mithril" );



m.mount( document.querySelector( '#todo-app' ), Todo );
