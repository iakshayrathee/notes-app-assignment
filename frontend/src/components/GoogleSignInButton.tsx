import React, { useEffect, useRef } from 'react';

interface GoogleSignInButtonProps {
  onSuccess: (token: string) => void;
  onError: (error: string) => void;
  disabled?: boolean;
}

declare global {
  interface Window {
    google: any;
  }
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  onSuccess,
  onError,
  disabled = false
}) => {
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    
    if (!clientId) {
      console.error('Google Client ID is not configured. Please check your .env file.');
      onError('Google Client ID is not configured');
      return;
    }

    const initializeGoogleSignIn = () => {
      if (window.google && window.google.accounts && buttonRef.current) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
          use_fedcm_for_prompt: false
        });

        // Render the actual Google Sign-In button
        window.google.accounts.id.renderButton(
          buttonRef.current,
          { 
            theme: 'outline', 
            size: 'large',
            width: '100%',
            text: 'continue_with'
          }
        );
      } else {
        // Wait for Google script to load
        setTimeout(initializeGoogleSignIn, 100);
      }
    };

    initializeGoogleSignIn();
  }, [onError]);

  const handleCredentialResponse = (response: any) => {
    if (response.credential) {
      onSuccess(response.credential);
    } else {
      onError('Google sign-in failed');
    }
  };

  return (
    <div 
      ref={buttonRef}
      className={`w-full ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
    />
  );
};

export default GoogleSignInButton;
