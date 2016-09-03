
import m from 'mithril';
import className from 'classnames';
import store from '../store';



// Instead of using @connected or @observer, we're just using the controller().
// May want to do something about that, though so we don't have to keep importing store
// for each top-level component.

const Todo = {
	controller() {
		return {
			// mobx values are observable.  Actually, like mithril's.  Wonder if I could skip mobx?
			// Mobx may do more automatically, though.
			todos: store.todos,
		}
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
						{ ctrl.todos.map( td => (
							<div className={ className( 'list-group-item', {
								'disabled': td.completed
							})}>{ td.task }</div>
						))}
					</div>
				</div>
			</div>
		);
	},
};



export default Todo;
