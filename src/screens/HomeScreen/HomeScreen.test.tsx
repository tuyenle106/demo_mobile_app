import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import HomeScreen from './HomeScreen';

describe('HomeScreen', () => {
  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(<HomeScreen />);
      expect(screen.getByTestId('home-screen')).toBeTruthy();
    });

    it('should render empty state when no tasks', () => {
      render(<HomeScreen />);
      fireEvent.press(screen.getByTestId('task-delete-1'));
      fireEvent.press(screen.getByTestId('task-delete-2'));
      expect(screen.getByTestId('empty-state')).toBeTruthy();
    });

    it('should not crash when pressing add with empty input', () => {
      render(<HomeScreen />);
      const addButton = screen.getByTestId('add-button');
      expect(() => fireEvent.press(addButton)).not.toThrow();
    });

    it('should not crash when toggling task complete', () => {
      render(<HomeScreen />);
      const toggleButton = screen.getByTestId('task-toggle-1');
      expect(() => fireEvent.press(toggleButton)).not.toThrow();
    });

    it('should display the title', () => {
      render(<HomeScreen />);
      expect(screen.getByText('My Tasks')).toBeTruthy();
    });

    it('should display task counter with initial tasks', () => {
      render(<HomeScreen />);
      expect(screen.getByTestId('task-counter')).toHaveTextContent('0 of 2 completed');
    });

    it('should render input field', () => {
      render(<HomeScreen />);
      expect(screen.getByTestId('task-input')).toBeTruthy();
      expect(screen.getByPlaceholderText('Add a new task...')).toBeTruthy();
    });

    it('should render add button', () => {
      render(<HomeScreen />);
      expect(screen.getByTestId('add-button')).toBeTruthy();
    });

    it('should render initial tasks', () => {
      render(<HomeScreen />);
      expect(screen.getByTestId('task-list')).toBeTruthy();
      expect(screen.getByText('Write unit tests')).toBeTruthy();
      expect(screen.getByText('Setup CI/CD')).toBeTruthy();
    });
  });

  describe('Adding Tasks', () => {
    it('should add a new task when add button is pressed', () => {
      render(<HomeScreen />);

      const input = screen.getByTestId('task-input');
      const addButton = screen.getByTestId('add-button');

      fireEvent.changeText(input, 'New test task');
      fireEvent.press(addButton);

      expect(screen.getByText('New test task')).toBeTruthy();
    });

    it('should clear input after adding a task', () => {
      render(<HomeScreen />);

      const input = screen.getByTestId('task-input');
      const addButton = screen.getByTestId('add-button');

      fireEvent.changeText(input, 'Another task');
      fireEvent.press(addButton);

      expect(input.props.value).toBe('');
    });

    it('should not add empty task', () => {
      render(<HomeScreen />);

      const input = screen.getByTestId('task-input');
      const addButton = screen.getByTestId('add-button');

      fireEvent.changeText(input, '');
      fireEvent.press(addButton);

      expect(screen.getByTestId('task-counter')).toHaveTextContent('0 of 2 completed');
    });

    it('should not add task with only whitespace', () => {
      render(<HomeScreen />);

      const input = screen.getByTestId('task-input');
      const addButton = screen.getByTestId('add-button');

      fireEvent.changeText(input, '   ');
      fireEvent.press(addButton);

      expect(screen.getByTestId('task-counter')).toHaveTextContent('0 of 2 completed');
    });

    it('should trim whitespace from task title', () => {
      render(<HomeScreen />);

      const input = screen.getByTestId('task-input');
      const addButton = screen.getByTestId('add-button');

      fireEvent.changeText(input, '  Trimmed task  ');
      fireEvent.press(addButton);

      expect(screen.getByText('Trimmed task')).toBeTruthy();
    });

    it('should update task counter after adding task', () => {
      render(<HomeScreen />);

      const input = screen.getByTestId('task-input');
      const addButton = screen.getByTestId('add-button');

      fireEvent.changeText(input, 'New task');
      fireEvent.press(addButton);

      expect(screen.getByTestId('task-counter')).toHaveTextContent('0 of 3 completed');
    });
  });

  describe('Toggling Tasks', () => {
    it('should toggle task completion when task is pressed', () => {
      render(<HomeScreen />);

      const firstTask = screen.getByTestId('task-toggle-1');
      fireEvent.press(firstTask);

      expect(screen.getByTestId('task-counter')).toHaveTextContent('1 of 2 completed');
    });

    it('should toggle task back to incomplete', () => {
      render(<HomeScreen />);

      const firstTask = screen.getByTestId('task-toggle-1');
      fireEvent.press(firstTask);
      fireEvent.press(firstTask);

      expect(screen.getByTestId('task-counter')).toHaveTextContent('0 of 2 completed');
    });

    it('should handle multiple tasks being completed', () => {
      render(<HomeScreen />);

      const firstTask = screen.getByTestId('task-toggle-1');
      const secondTask = screen.getByTestId('task-toggle-2');

      fireEvent.press(firstTask);
      fireEvent.press(secondTask);

      expect(screen.getByTestId('task-counter')).toHaveTextContent('2 of 2 completed');
    });
  });

  describe('Deleting Tasks', () => {
    it('should delete a task when delete button is pressed', () => {
      render(<HomeScreen />);

      const deleteButton = screen.getByTestId('task-delete-1');
      fireEvent.press(deleteButton);

      expect(screen.queryByText('Write unit tests')).toBeNull();
      expect(screen.getByTestId('task-counter')).toHaveTextContent('0 of 1 completed');
    });

    it('should show empty state when all tasks are deleted', () => {
      render(<HomeScreen />);

      const deleteButton1 = screen.getByTestId('task-delete-1');
      const deleteButton2 = screen.getByTestId('task-delete-2');

      fireEvent.press(deleteButton1);
      fireEvent.press(deleteButton2);

      expect(screen.getByTestId('empty-state')).toBeTruthy();
      expect(screen.getByText('No tasks yet!')).toBeTruthy();
      expect(screen.getByText('Add your first task above')).toBeTruthy();
    });

    it('should update counter when deleting completed task', () => {
      render(<HomeScreen />);

      const toggleButton = screen.getByTestId('task-toggle-1');
      fireEvent.press(toggleButton);

      expect(screen.getByTestId('task-counter')).toHaveTextContent('1 of 2 completed');

      const deleteButton = screen.getByTestId('task-delete-1');
      fireEvent.press(deleteButton);

      expect(screen.getByTestId('task-counter')).toHaveTextContent('0 of 1 completed');
    });
  });

  describe('Task Counter', () => {
    it('should show correct count with no completed tasks', () => {
      render(<HomeScreen />);
      expect(screen.getByTestId('task-counter')).toHaveTextContent('0 of 2 completed');
    });

    it('should update counter when completing tasks', () => {
      render(<HomeScreen />);

      fireEvent.press(screen.getByTestId('task-toggle-1'));
      expect(screen.getByTestId('task-counter')).toHaveTextContent('1 of 2 completed');

      fireEvent.press(screen.getByTestId('task-toggle-2'));
      expect(screen.getByTestId('task-counter')).toHaveTextContent('2 of 2 completed');
    });

    it('should show 0 of 0 when all tasks deleted', () => {
      render(<HomeScreen />);

      fireEvent.press(screen.getByTestId('task-delete-1'));
      fireEvent.press(screen.getByTestId('task-delete-2'));

      expect(screen.getByTestId('task-counter')).toHaveTextContent('0 of 0 completed');
    });
  });

  describe('Integration', () => {
    it('should handle complete user flow: add, complete, delete', () => {
      render(<HomeScreen />);

      const input = screen.getByTestId('task-input');
      const addButton = screen.getByTestId('add-button');

      fireEvent.changeText(input, 'Integration test task');
      fireEvent.press(addButton);

      expect(screen.getByText('Integration test task')).toBeTruthy();

      const newTaskToggle = screen.getAllByTestId(/task-toggle-/)[2];
      fireEvent.press(newTaskToggle);

      expect(screen.getByTestId('task-counter')).toHaveTextContent('1 of 3 completed');

      const newTaskDelete = screen.getAllByTestId(/task-delete-/)[2];
      fireEvent.press(newTaskDelete);

      expect(screen.queryByText('Integration test task')).toBeNull();
      expect(screen.getByTestId('task-counter')).toHaveTextContent('0 of 2 completed');
    });

    it('should allow adding task by pressing enter on keyboard', () => {
      render(<HomeScreen />);

      const input = screen.getByTestId('task-input');

      fireEvent.changeText(input, 'Task via enter');
      fireEvent(input, 'submitEditing');

      expect(screen.getByText('Task via enter')).toBeTruthy();
    });
  });
});
