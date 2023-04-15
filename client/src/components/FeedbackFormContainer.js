import React, { useState } from 'react';

const FeedbackForm = () => {
  const [name, setName] = useState('');
  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Verify the CAPTCHA text before submitting the form
    const captchaResponse = await fetch('/api/captcha', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ captcha }),
    });
    const captchaData = await captchaResponse.json();

    if (captchaData.success) {
      // CAPTCHA text matched, submit the feedback form
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, feedback, email, captcha }),
      });

      if (response.ok) {
        // Feedback form submission successful
        setSuccess(true);
        setError(null);
      } else {
        // Handle the error response from the server
        const errorData = await response.json();
        setError(errorData.message);
        setSuccess(false);
      }
    } else {
      // CAPTCHA text did not match, show an error
      setError('CAPTCHA validation failed. Please try again.');
      setSuccess(false);
    }
  };

  return (
    <div>
      {success ? (
        <p>Thank you for your feedback!</p>
      ) : (
        <FeedbackFormContainer
          name={name}
          setName={setName}
          feedback={feedback}
          setFeedback={setFeedback}
          email={email}
          setEmail={setEmail}
          captcha={captcha}
          setCaptcha={setCaptcha}
          error={error}
          handleFormSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
};

const FeedbackFormContainer = ({
  name,
  setName,
  feedback,
  setFeedback,
  email,
  setEmail,
  captcha,
  setCaptcha,
  error,
  handleFormSubmit,
}) => {
  return (
    <form onSubmit={handleFormSubmit}>
      {/* Render the feedback form */}
      {/* Your form fields go here */}
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Feedback"
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="text"
        placeholder="CAPTCHA"
        value={captcha}
        onChange={(e) => setCaptcha(e.target.value)}
      />
      {error && <p>{error}</p>}
      <button type="submit">Submit</button>
    </form>
  );
};

export default FeedbackForm;
