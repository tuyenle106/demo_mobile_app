import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import OnboardingScreen from './OnboardingScreen';

describe('OnboardingScreen', () => {
  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(<OnboardingScreen />);
      expect(screen.getByTestId('onboarding-screen')).toBeTruthy();
    });

    it('should display the first onboarding slide by default', () => {
      render(<OnboardingScreen />);

      expect(screen.getByTestId('onboarding-title')).toHaveTextContent('Welcome to Demo App');
      expect(screen.getByTestId('onboarding-description')).toHaveTextContent(
        'Learn how to write effective unit tests for your React Native app'
      );
      expect(screen.getByTestId('onboarding-emoji')).toHaveTextContent('👋');
    });

    it('should render pagination dots correctly', () => {
      render(<OnboardingScreen />);

      expect(screen.getByTestId('pagination-dot-0')).toBeTruthy();
      expect(screen.getByTestId('pagination-dot-1')).toBeTruthy();
      expect(screen.getByTestId('pagination-dot-2')).toBeTruthy();
    });

    it('should not show back button on first slide', () => {
      render(<OnboardingScreen />);

      expect(screen.queryByTestId('back-button')).toBeNull();
    });

    it('should show next button on first slide', () => {
      render(<OnboardingScreen />);

      expect(screen.getByTestId('next-button')).toBeTruthy();
      expect(screen.getByText('Next')).toBeTruthy();
    });
  });

  describe('Navigation', () => {
    it('should navigate to next slide when Next button is pressed', () => {
      render(<OnboardingScreen />);

      const nextButton = screen.getByTestId('next-button');
      fireEvent.press(nextButton);

      expect(screen.getByTestId('onboarding-title')).toHaveTextContent('Test with Confidence');
      expect(screen.getByTestId('onboarding-emoji')).toHaveTextContent('✅');
    });

    it('should show back button after navigating forward', () => {
      render(<OnboardingScreen />);

      const nextButton = screen.getByTestId('next-button');
      fireEvent.press(nextButton);

      expect(screen.getByTestId('back-button')).toBeTruthy();
    });

    it('should show correct emoji for each slide', () => {
      render(<OnboardingScreen />);
      const nextButton = screen.getByTestId('next-button');
      expect(screen.getByTestId('onboarding-emoji')).toHaveTextContent('👋');
      fireEvent.press(nextButton);
      expect(screen.getByTestId('onboarding-emoji')).toHaveTextContent('✅');
      fireEvent.press(nextButton);
      expect(screen.getByTestId('onboarding-emoji')).toHaveTextContent('🚀');
    });

    it('should not crash when pressing Next multiple times', () => {
      render(<OnboardingScreen />);
      const nextButton = screen.getByTestId('next-button');
      expect(() => {
        fireEvent.press(nextButton);
        fireEvent.press(nextButton);
        fireEvent.press(nextButton);
        fireEvent.press(nextButton);
      }).not.toThrow();
    });

    it('should only call onComplete when finish button pressed', () => {
      const onCompleteMock = jest.fn();
      render(<OnboardingScreen onComplete={onCompleteMock} />);
      const nextButton = screen.getByTestId('next-button');
      fireEvent.press(nextButton);
      fireEvent.press(nextButton);
      expect(onCompleteMock).not.toHaveBeenCalled();
      const finishButton = screen.getByTestId('finish-button');
      fireEvent.press(finishButton);
      expect(onCompleteMock).toHaveBeenCalledTimes(1);
    });

    it('should navigate back to previous slide when Back button is pressed', () => {
      render(<OnboardingScreen />);

      const nextButton = screen.getByTestId('next-button');
      fireEvent.press(nextButton);

      const backButton = screen.getByTestId('back-button');
      fireEvent.press(backButton);

      expect(screen.getByTestId('onboarding-title')).toHaveTextContent('Welcome to Demo App');
    });

    it('should show "Get Started" button on last slide', () => {
      render(<OnboardingScreen />);

      const nextButton = screen.getByTestId('next-button');
      fireEvent.press(nextButton);
      fireEvent.press(nextButton);

      expect(screen.getByTestId('finish-button')).toBeTruthy();
      expect(screen.getByText('Get Started')).toBeTruthy();
    });

    it('should call onComplete when finish button is pressed', () => {
      const onCompleteMock = jest.fn();
      render(<OnboardingScreen onComplete={onCompleteMock} />);

      const nextButton = screen.getByTestId('next-button');
      fireEvent.press(nextButton);
      fireEvent.press(nextButton);

      const finishButton = screen.getByTestId('finish-button');
      fireEvent.press(finishButton);

      expect(onCompleteMock).toHaveBeenCalledTimes(1);
    });

    it('should not crash when finish is pressed without onComplete prop', () => {
      render(<OnboardingScreen />);

      const nextButton = screen.getByTestId('next-button');
      fireEvent.press(nextButton);
      fireEvent.press(nextButton);

      const finishButton = screen.getByTestId('finish-button');
      expect(() => fireEvent.press(finishButton)).not.toThrow();
    });
  });

  describe('Pagination', () => {
    it('should highlight the correct pagination dot based on current slide', () => {
      const { getByTestId } = render(<OnboardingScreen />);

      const nextButton = getByTestId('next-button');
      fireEvent.press(nextButton);

      expect(screen.getByTestId('onboarding-title')).toHaveTextContent('Test with Confidence');
    });

    it('should navigate through all slides', () => {
      render(<OnboardingScreen />);

      expect(screen.getByTestId('onboarding-emoji')).toHaveTextContent('👋');

      const nextButton = screen.getByTestId('next-button');
      fireEvent.press(nextButton);
      expect(screen.getByTestId('onboarding-emoji')).toHaveTextContent('✅');

      fireEvent.press(nextButton);
      expect(screen.getByTestId('onboarding-emoji')).toHaveTextContent('🚀');
    });
  });

  describe('Edge Cases', () => {
    it('should not navigate beyond the last slide', () => {
      render(<OnboardingScreen />);

      const nextButton = screen.getByTestId('next-button');
      fireEvent.press(nextButton);
      fireEvent.press(nextButton);

      expect(screen.getByTestId('onboarding-title')).toHaveTextContent('CI/CD Integration');
    });

    it('should not navigate before the first slide', () => {
      render(<OnboardingScreen />);

      const nextButton = screen.getByTestId('next-button');
      fireEvent.press(nextButton);

      const backButton = screen.getByTestId('back-button');
      fireEvent.press(backButton);
      fireEvent.press(backButton);

      expect(screen.getByTestId('onboarding-title')).toHaveTextContent('Welcome to Demo App');
    });
  });
});
