export class RegisterRequest {
    name: string;
    username: string;
    password: string;
    student_id: string;

    constructor(name: string, username: string, password: string, student_id: string) {
        this.name = name;
        this.username = username;
        this.password = password;
        this.student_id = student_id;
    }
}


