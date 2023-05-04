import React, {useState} from 'react';
import {Form, Button, Container} from "react-bootstrap";
import Link from "next/link";
import {notify} from "../helpers/helper";

const Reset = (): JSX.Element => {
    const [email, setEmail] = useState<string>('');

    const handleSubmit = (e: React.SyntheticEvent): void => {
        e.preventDefault();
        try {
            console.log(email);
            notify(`Пароль отправлен на почту: ${email}`, false);
        } catch (e) {}
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setEmail(e.target.value);
    };


    return (
        <Container className="position-absolute top-50 start-50 translate-middle w-auto border border-primary border-2
         rounded-3 p-3">
            <Form className="d-grid align-items-center">
                <h1 className="text-center">Сброс пароля</h1>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Адрес почты</Form.Label>
                    <Form.Control type="email" placeholder="Введите почтовый адрес" onChange={handleEmailChange}/>
                </Form.Group>
                <Button variant="primary" type="submit" onClick={handleSubmit}>
                    Отправить пароль
                </Button>
                <Form.Group className="mt-2 text-center" controlId="back">
                    <Link href="/login"><a>Назад</a></Link>
                </Form.Group>
            </Form>
        </Container>
    );
};

export default Reset;