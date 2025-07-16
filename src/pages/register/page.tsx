// Libraries
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, MicVocal } from 'lucide-react';

// Application
import './page.scss';
import { Loader, Page } from '@/components';
import { Form, FormHandler } from '@/modules/form';
import { Alert } from '@/components/Alert';
import { talksService, TalksService } from '@/services/talks-service';
import { RouteSegment } from '@/application/router/types';

const RegisterPage = () => {

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

    const handleRegister = async () => {
        setIsLoading(true);
        const response = await talksService.users.register(form);
        setIsLoading(false);

        if (response.is(204))
            return navigate(RouteSegment.Login);
        else if (response.is(400))
            return setError(ERROR_MESSAGES[response.body.type]);
        else
            return setError(ERROR_MESSAGES['unknown-error']);
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
                        Créer un compte
                    </h1>
                    <Form.Field
                        label="Prénom"
                        name='firstName'
                        value={form.firstName}
                        onChange={handleChanges}
                    />
                    <Form.Field
                        label="Nom"
                        name='lastName'
                        value={form.lastName}
                        onChange={handleChanges}
                    />
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
                        Déjà membre ? <Link className='animated' to={`/${RouteSegment.Login}`}>Se connecter.</Link>
                    </p>
                    <button
                        className='animated'
                        onClick={handleRegister}
                    >
                        S'enregistrer
                    </button>
                </div>
            </div>
        </Page>
    )
};

const defaultLoginForm: TalksService.Models.User.Register = {
    firstName: '',
    lastName: '',
    email: '',
    password: ''
}

const ERROR_MESSAGES: {
    [Type in TalksService.Responses.User.Register[400]['type']]: string;
} = {
    'email-already-used': 'Email déjà utilisée.',
    'invalid-email': 'Email non valide.',
    'missing-fields': 'Certains champs sont manquants.',
    'unknown-error': 'Une erreur inconnue est survenue.',
};

export default RegisterPage;