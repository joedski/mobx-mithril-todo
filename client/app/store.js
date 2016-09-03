
import { observable, computed, autorun } from 'mobx';

class TodoStore {
	@observable todos = [];
	@observable pendingRequests = 0;

	constructor() {
		autorun( () => console.log( this.report ) );
	}

	@computed get completedTodosCount() {
		return this.todos.filter(
			t => t.completed === true
		).length;
	}

	@computed get report() {
		if( this.todos.length === 0 ) {
			return '<none>';
		}

		return `Next todo: ${ this.todos[ 0 ].task } ` +
			`Progress: ${ this.completedTodosCount }/${ this.todos.length }`
			;
	}

	// @computed get currentTodo() {
	// 	// Get the first not completed item.
	// 	return this.todos.find( t => t.completed === false );
	// }

	addTodo( task ) {
		this.todos.push({
			task,
			completed: false,
			asignee: null,
		});
	}
}

export default new TodoStore();
