MobX (And Mithril)
==================

Doing the Todo using MobX as the store and Mithril as the UI.  This was an exercise to learn MobX.  Mithril was just used because it's familiar.



On Legacy Support
-----------------

MobX uses getters for computed properties.  This restricts it to IE9 or newer.  MobX cannot be used in legacy environments.  Pure Mithril is probably better for that case, even if it's less magical.

### Mithril Store

The Store, which doesn't include the autorun reporter, would look something like this.  Most of the additional length is due to explicitly defining TodoItem.

```js
import { prop } from 'mithril';

class TodoItem {
	// We can subscribe to some global thing, but Mithril doesn't include
	// anything like mobx.autorun which hooks into observables.

	constructor( task ) {
		this.task = prop( task );
		this.completed = prop( false );
		this.asignee = prop( null );
	}
}

class TodoStore {
	constructor() {
		// Another difference: Mithril works better with value replacement
		// e.g. fp-type assocIn rather than direct mutation.
		this.todos = prop( [] );
		this.pendingRequests = prop( 0 );
	}

	// Getters are defined just as plain functions.  Note, however,
	// that m.props are also functions.
	// That is, this.todos() gets the value, this.todos([ ... ]) sets it.
	// So, using plain methods rather than setters is consistent with Mithril.
	completedTodosCount() {
		return this.todos.filter( t => t.completed() === true ).length;
	}

	report() {
		if( this.todos().length === 0 ) {
			return '<none>';
		}

		let currentTodo = this.currentTodo();
		let currentTask;

		if( currentTodo ) {
			currentTask = currentTodo.task();
		}
		else {
			currentTask = "(All done!)";
		}

		return `Next todo: ${ currentTask } ` +
			`Progress: ${ this.completedTodosCount() }/${ this.todos.length }`
			;
	}

	currentTodo() {
		return this.todos.find( t => t.completed() === true );
	}



	//// Actions

	addTodo( task ) {
		// Lodash doesn't have an fp push...?  That seems like a bit of an ommission.
		let todos = this.todos().slice();
		todos.push( new TodoItem( task ) );
		this.todos( todos );
	}

	toggleTodo( todoItem ) {
		todoItem.completed( ! todoItem.completed() );
	}
}
```
