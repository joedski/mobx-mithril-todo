
import m from 'mithril';
import store from './store';
import className from 'classnames';
import Todo from './components/Todo';



// Should log things.
store.addTodo( "Start Learning MobX" );
store.addTodo( "Things" );
store.todos[ 0 ].completed = true;
store.addTodo( "Determine if MobX is necessary like this with Mithril" );



// A note: No real connections are made between Mithril and Mobx.
// All that happens is:
// - Mithril emits an event, scheduling a redraw.
// - Hook calls an updater on the store.
// - Store updates.
// - Mithril redraw occurs.
m.mount( document.querySelector( '#todo-app' ), Todo );
