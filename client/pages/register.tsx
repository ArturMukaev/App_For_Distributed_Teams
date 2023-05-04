import React, {useCallback, useState} from "react";
import {Button, Container, Form} from "react-bootstrap";
import Link from "next/link";
import {useHttp} from "../hooks/useHTTP";
import {useRouter} from "next/router";

interface IRegistrationState {
    email: string;
    password: string;
    name: string;
    surname: string;
}

const Register = (): JSX.Element => {

    const {request, loading} = useHttp();
    const router = useRouter();

    /** State */
    const [registrationState, setRegistrationState] = useState<IRegistrationState>({
        email: '',
        password: '',
        name: '',
        surname: '',
    });

    /** Handlers */
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
            const {name, value} = e.target;
            setRegistrationState({
                ...registrationState,
                [name]: value,
            });
        }, [registrationState],
    );

    const handleRegister = useCallback(async (e: React.SyntheticEvent): Promise<void> => {
        e.preventDefault();
        try {
            await request({url: '/api/auth/register', method: "POST", body: {...registrationState}});
            await router.push('/login');
        } catch (error) {
        }
    }, [request, registrationState, router]);

    return (
        <Container className="position-absolute top-50 start-50 translate-middle w-auto border border-primary border-2
         rounded-3 px-lg-5 py-3">
            <Form className="d-grid align-items-center">
                <h1 className="text-center">Регистрация</h1>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Адрес почты</Form.Label>
                    <Form.Control name="email" type="email" placeholder="Введите почтовый адрес"
                                  onChange={handleInputChange}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicName">
                    <Form.Label>Имя</Form.Label>
                    <Form.Control name="name" type="text" placeholder="Введите имя" onChange={handleInputChange}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicSurname">
                    <Form.Label>Фамилия</Form.Label>
                    <Form.Control name="surname" type="text" placeholder="Введите фамилию"
                                  onChange={handleInputChange}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Пароль</Form.Label>
                    <Form.Control name="password" type="password" placeholder="Введите пароль"
                                  onChange={handleInputChange}/>
                </Form.Group>
                <Button variant="primary" type="submit" onClick={handleRegister} disabled={loading}>
                    Регистрация
                </Button>
                <Form.Group className="mt-2 text-center" controlId="back">
                    <Link href="/login"><a>Назад</a></Link>
                </Form.Group>
            </Form>
        </Container>
    );
};

export default Register;