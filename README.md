MobX (And Mithril)
==================

Doing the Todo using MobX as the store and Mithril as the UI.  This was an exercise to learn MobX.  Mithril was just used because it's familiar.



Analysis
--------

I haven't yet looked into doing `observer` support for Mithril, I'd only just started with MobX.  However, it probably doesn't have quite as efficient rendering due to this.  As Mithril and MobX are basically wholly separate in this setup, all the redraw is handled solely by Mithril's system.

As Mithril's redraws are triggered by handling events rather than listening to data changes, this changes nothing on the Mithtril side.  This is also why Mithril works well with relatively dumb data stores, and why extra care must be taken with long running async operations.

Of course, in that case, you can just hook it to MobX's `autorun` or the like.  Determining whether you need to diff or full rerender is left as an exercise to the reader, but so long as you don't force an immediate render, Mithril will autobatch any calls `autorun` causes to `m.redraw` to just one actual redraw the next frame.  Natuarally, if you're executing multiple requests, you  may want to consider `m.startComputation` and `m.endComputation`, though in my experience, simply accounting for not having (yet) received data is better than deferring until you do have it.  Probably because most of the remote things I do are API server calls to remote servers...  Well.



On Legacy Support
-----------------

MobX uses getters for computed properties.  This restricts it to IE9 or newer.  MobX cannot be used in legacy environments.  Pure Mithril is probably better for that case, even if it's less magical.  If you really need something heavy duty, well, there's always Redux.


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
