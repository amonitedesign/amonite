import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { fireEvent, screen } from '@testing-library/dom';
import WaitlistModal from './waitlist-modal';

describe('waitlist-modal', () => {
  it('renders nothing when closed', () => {
    const { container } = render(<WaitlistModal isOpen={false} onClose={() => {}} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('requires an email to submit', () => {
    render(<WaitlistModal isOpen onClose={() => {}} />);
    const input = screen.getByPlaceholderText('you@studio.co');
    expect(input).toHaveAttribute('required');
    expect(input).toHaveAttribute('type', 'email');
  });

  it('submits and shows confirmation with the email echoed', () => {
    render(<WaitlistModal isOpen onClose={() => {}} />);
    fireEvent.change(screen.getByPlaceholderText('you@studio.co'), {
      target: { value: 'designer@studio.co' },
    });
    fireEvent.click(screen.getByText('Request Early Access'));
    expect(screen.getByText("You're on the list!")).toBeInTheDocument();
    expect(screen.getByText('designer@studio.co')).toBeInTheDocument();
  });

  it('closes via X and Back buttons', () => {
    const onClose = vi.fn();
    const { rerender } = render(<WaitlistModal isOpen onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: '' })); // X icon button
    expect(onClose).toHaveBeenCalled();
    rerender(<WaitlistModal isOpen onClose={onClose} />);
    fireEvent.change(screen.getByPlaceholderText('you@studio.co'), {
      target: { value: 'a@b.io' },
    });
    fireEvent.click(screen.getByText('Request Early Access'));
    fireEvent.click(screen.getByText('Back to Studio'));
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
