import React, {useState, useCallback} from 'react';
import {Form, Button, Container, Col, Row} from "react-bootstrap";
import Link from "next/link";
import {useHttp} from "../hooks/useHTTP";
import {useDispatch} from "react-redux";
import {login} from "../redux/reducers/authReducer";
import {useRouter} from "next/router";

interface ILoginState {
    email: string;
    password: string;
    showPassword: boolean;
}

const Login = (): JSX.Element => {

    const {request, loading} = useHttp();
    const dispatch = useDispatch();
    const router = useRouter();

    /** State */
    const [loginState, setLoginState] = useState<ILoginState>({
        email: '',
        password: '',
        showPassword: false,
    });

    /** Handlers */
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
            const {name, value} = e.target;
            setLoginState({
                ...loginState,
                [name]: value,
            });
        }, [loginState],
    );

    const handleShowPassword = useCallback((): void => {
        setLoginState({
            ...loginState,
            showPassword: !loginState.showPassword,
        });
    }, [loginState]);


    const handleLogin = useCallback(async (e: React.SyntheticEvent): Promise<void> => {
        e.preventDefault();
        try {
            const data = await request({url: '/api/auth/login', method: "POST", body: {...loginState}});
            dispatch(login(data));
            await router.push('/');
        } catch (error) {
        }
    }, [request, loginState, dispatch, router]);

    return (
        <Container className="position-absolute top-50 start-50 translate-middle w-auto border border-primary border-2
         rounded-3 p-3">
            <Form>
                <h1 className="text-center">Авторизация</h1>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Адрес почты</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Введите почтовый адрес"
                        name="email"
                        value={loginState.email}
                        onChange={handleInputChange}/>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Пароль</Form.Label>
                    <Form.Control
                        id="formPassword"
                        type={loginState.showPassword ? 'text' : 'password'}
                        placeholder="Введите пароль" name="password"
                        value={loginState.password}
                        onChange={handleInputChange}/>
                    <Form.Check
                        className="mt-2"
                        id="formPasswordCheckBox"
                        type="checkbox"
                        label="Показать пароль"
                        checked={loginState.showPassword}
                        onChange={handleShowPassword}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="reset">
                    <Link href="/reset"><a style={{fontSize: "14px"}}>Забыли пароль?</a></Link>
                </Form.Group>

                <Row>
                    <Col>
                        <Button variant="primary" type="submit" onClick={handleLogin} disabled={loading}>
                            Войти
                        </Button>
                    </Col>
                    <Col>
                        <Link href="/register">
                            <Button variant="primary">
                                Зарегистрироваться
                            </Button>
                        </Link>
                    </Col>
                </Row>
            </Form>
        </Container>
    );
};

export default Login;
