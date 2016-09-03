
import store from './store';

// Should log things.
store.addTodo( "Stuff" );
store.addTodo( "Things" );
store.todos[ 0 ].completed = true;
store.addTodo( "Boof" );
