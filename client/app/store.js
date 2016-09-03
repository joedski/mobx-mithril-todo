
import { observable, computed, autorun } from 'mobx';

class TodoStore {
	constructor() {
		autorun( () => console.log( this.report ) );
	}

	@observable todos = [];
	@observable pendingRequests = 0;

	@computed get completedTodosCount() {
		return this.todos.filter(
			t => t.completed === true
		).length;
	}

	@computed get report() {
		if( this.todos.length === 0 ) {
			return '<none>';
		}

		let currentTodo = this.currentTodo;
		let currentTask;

		if( currentTodo ) {
			currentTask = currentTodo.task;
		}
		else {
			currentTask = "(All done!)";
		}

		return `Next todo: ${ currentTask } ` +
			`Progress: ${ this.completedTodosCount }/${ this.todos.length }`
			;
	}

	@computed get currentTodo() {
		// Get the first not completed item.
		return this.todos.find( t => t.completed === false );
	}



	//// Actions

	addTodo( task ) {
		this.todos.push({
			task,
			completed: false,
			asignee: null,
		});
	}

	toggleTodo( todoItem ) {
		todoItem.completed = ! todoItem.completed;
	}
}

export default new TodoStore();
