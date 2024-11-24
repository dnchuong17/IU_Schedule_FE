export class RegisterRequest {
    name: string;
    email: string;
    password: string;
    student_id: string;

    constructor(name: string, email: string, password: string, student_id: string) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.student_id = student_id;
    }
}


