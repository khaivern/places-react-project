import Card from '../components/UIElements/Card';

interface ErrorFormProps {
  errorText: string;
  clearError: () => void;
}

const ErrorForm: React.FC<ErrorFormProps> = ({ errorText, clearError }) => {
  return (
    <div className='centered' onClick={clearError}>
      <Card className='card--error'>
        <h2>{errorText}</h2>
      </Card>
    </div>
  );
};

export default ErrorForm;
