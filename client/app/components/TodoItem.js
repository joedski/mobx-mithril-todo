
import m from 'mithril';
import className from 'classnames';



const TodoItem = {
	// attrs instead of props because convention.
	view( _, attrs ) {
		return (
			<div className={ className( 'list-group-item', {
				'list-group-item-info': attrs.isCurrent,
				'disabled': attrs.todo.completed,
			})}
				onclick={ attrs.onClick }>
				<i className={ className( 'glyphicon glyphicon-ok' )}
					style={ `opacity: ${ attrs.todo.completed ? 1 : 0.2 };` }
					></i>
				{ ' ' }
				{ attrs.todo.task }
			</div>
		);
	}
};



export default TodoItem;
