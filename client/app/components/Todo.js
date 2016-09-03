
import m from 'mithril';
import className from 'classnames';
import store from '../store';
import TodoItem from './TodoItem';



// Instead of using @connected or @observer, we're just using the controller().
// May want to do something about that, though so we don't have to keep importing store
// for each top-level component.

const Todo = {
	controller() {
		return {
			// So, this is the simplest way I can think of to do this.
			// Hmmm.
			// Note: In the Mithril tutorial, the Top Level View references its viewmodel directly,
			// the Controller either constructing it directly or merely initializing it.
			// So, making getters and mutators here, I'm effectively constructing the VM here.
			// Pros: custom selectors are defined here.
			// Cons: custom selectors are not lazy/observable.
			// Mitigation: Expensive selectors should either be Reselects or attached directly to the store.
			get todos() { return store.todos },
			get currentTodo() { return store.currentTodo },

			// Event Hooks.
			// Remember, custom in Mithril is to make event handler factories,
			// so if you don't have a todoItem you just () the first item.
			onToggleItem: todoItem => () => store.toggleTodo( todoItem )
		};
	},

	view( ctrl ) {
		return (
			<div className="todo-list container">
				<h1>Things To Do</h1>
				<div className="panel panel-primary">
					<div className="panel-heading">
						<h3 className="panel-title">Current Tasks</h3>
					</div>
					<div className="list-group">
						{ ctrl.todos.map( td =>
							<TodoItem
								todo={ td }
								isCurrent={ td === ctrl.currentTodo }
								onClick={ ctrl.onToggleItem( td ) }
								/>
						)}
					</div>
				</div>
			</div>
		);
	},
};



export default Todo;
