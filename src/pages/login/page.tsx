// Libraries
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, MicVocal } from 'lucide-react';

// Application
import './page.scss';
import { Loader, Page } from '@/components';
import { Form, FormHandler } from '@/modules/form';
import { Alert } from '@/components/Alert';
import { useAuthentication } from '@/hooks';
import { TalksService } from '@/services/talks-service';
import { RouteSegment } from '@/application/router/types';

const LoginPage = () => {

    const { login } = useAuthentication();

    const navigate = useNavigate();

    const [form, setForm] = useState(defaultLoginForm);

    const [showPassword, setShowPassword] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleChanges: FormHandler<ValueOf<typeof form>> = ({ name, value }) => {
        setForm(current => ({
            ...current,
            [name]: value
        }));
    }

    const handleToggleShowPassword = () => setShowPassword(current => !current);

    const handleLogin = async () => {
        setIsLoading(true);
        const success = await login(form.email, form.password);

        if (!success) {
            setError("Wrong identifiers")
            return setIsLoading(false);
        };

        setIsLoading(false);
        navigate(`/${RouteSegment.Conferences}`);
    }

    if (isLoading)
        return (
            <Page id='login-page'>
                <Loader />
            </Page>
        );

    return (
        <Page id='login-page'>
            <div className="left">
                <div className="application-name">
                    <MicVocal />
                    <p>TALKS</p>
                </div>
            </div>
            <div className="right">
                <div className="form">
                    <h1>
                        Se connecter
                    </h1>
                    <Form.Field
                        label="Email"
                        name='email'
                        value={form.email}
                        onChange={handleChanges}
                    />
                    <Form.Field
                        label='Password'
                        name='password'
                        value={form.password}
                        onChange={handleChanges}
                        type={showPassword ? 'text' : 'password'}
                        endElement={(
                            <button
                                className='icon-button'
                                onClick={handleToggleShowPassword}
                            >
                                {showPassword ? <EyeOff /> : <Eye />}
                            </button>
                        )}
                    />
                    {!!error && (
                        <Alert variant='destructive'>
                            <p>{error}</p>
                        </Alert>
                    )}
                    <p className='register'>
                        Pas de compte ? <Link className='animated' to={`/${RouteSegment.Register}`}>S'enregistrer</Link>
                    </p>
                    <button
                        className='animated'
                        onClick={handleLogin}
                    >
                        Se connecter
                    </button>
                </div>
            </div>
        </Page>
    )
};

const defaultLoginForm: TalksService.Models.User.Login = {
    email: '',
    password: ''
}

export default LoginPage;