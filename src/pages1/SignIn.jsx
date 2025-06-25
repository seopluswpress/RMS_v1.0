import React from 'react';

import { SignIn } from '@clerk/clerk-react';
import Navbar from './Navbar';
import { Link } from 'react-router-dom';

function SignInPage() {
  return (
    <>
      <Navbar />
      <div className="auth-container">
        <div className="auth-logo-wrapper">
          <img className="auth-logo-img" src="/assets/images/favicon.png" alt="RMS Logo" />
          <div style={{ marginTop: 60, width: '100%' }}>
            <SignIn
              appearance={{
                variables: {
                  colorPrimary: '#f8d4cc',
                  colorTextOnPrimaryBackground: '#6b2b10'
                },
                elements: {
                  formButtonPrimary: {
                    backgroundColor: '#f8d4cc',
                    color: '#6b2b10',
                    border: 'none'
                  },
                  footerAction: {
                    display: 'none' // Hide Clerk's default footer action (text and link)
                  },
                headerTitle: {
  fontSize: '1rem',
  fontWeight: 400,
  lineHeight: '1.2',
  textAlign: 'center',
  marginBottom: '0.5rem',
  whiteSpace: 'nowrap',
  maxWidth: '100%',
},
cardTitle: {
  fontSize: '1rem',
  fontWeight: 400,
  lineHeight: '1.2',
  textAlign: 'center',
  marginBottom: '0.5rem',
  whiteSpace: 'nowrap',
  maxWidth: '100%',
},
formHeaderTitle: {
  fontSize: '1rem',
  fontWeight: 400,
  lineHeight: '1.2',
  textAlign: 'center',
  marginBottom: '0.5rem',
  whiteSpace: 'nowrap',
  maxWidth: '100%',
},
title: {
  fontSize: '1rem',
  fontWeight: 400,
  lineHeight: '1.2',
  textAlign: 'center',
  marginBottom: '0.5rem',
  whiteSpace: 'nowrap',
  maxWidth: '100%',
},
                  card: {
                    paddingBottom: '1.5rem'
                  }
                }
              }}
              localization={{
                signIn: {
                  start: {
                    title: 'Sign in to RMS',
                    subtitle: ''
                  }
                }
              }}
              fallbackRedirectUrl="/user-details"
              afterSignIn={
                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                  <span style={{ color: '#96351E', fontWeight: 500 }}>
                    Don't have an account?{' '}
                  </span>
                  <Link
                    to="/signup"
                    style={{
                      color: 'maroon',
                      fontWeight: 'bold',
                      textDecoration: 'underline'
                    }}
                  >
                    Sign up
                  </Link>
                </div>
              }
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default SignInPage;
