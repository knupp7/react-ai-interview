// validateSignupForm.js
export default function validateSignupForm(form, gender) {
    const newErrors = {};

    if (!form.userid) {
        newErrors.userid = '아이디를 입력해주세요.';
    } else if (!/^[a-zA-Z0-9]{4,12}$/.test(form.userid)) {
        newErrors.userid = '아이디는 영문/숫자 조합 4~12자여야 합니다.';
    }

    if (!form.userpwd) {
        newErrors.userpwd = '비밀번호를 입력해주세요.';
    } else if (form.userpwd.length < 6) {
        newErrors.userpwd = '비밀번호는 최소 6자 이상이어야 합니다.';
    }

    if (!form.userpwdCheck) {
        newErrors.userpwdCheck = '비밀번호 확인을 입력해주세요.';
    } else if (form.userpwd !== form.userpwdCheck) {
        newErrors.userpwdCheck = '비밀번호가 일치하지 않습니다.';
    }

    if (!form.name) {
        newErrors.name = '이름을 입력해주세요.';
    } else if (form.name.length > 7) {
        newErrors.name = '이름은 7자 이내여야 합니다.';
    } else if (!/^[가-힣a-zA-Z]+$/.test(form.name)) {
        newErrors.name = '이름에는 한글 또는 영문자만 입력 가능합니다.';
    }

    if (!form.age) {
        newErrors.age = '나이를 입력해주세요.';
    } else if (!/^\d+$/.test(form.age)) {
        newErrors.age = '나이는 숫자만 입력해주세요.';
    } else if (Number(form.age) < 1 || Number(form.age) > 100) {
        newErrors.age = '나이는 1살 이상 100살 이하로 입력해주세요.';
    }

    if (!gender) {
        newErrors.gender = '성별을 선택해주세요.';
    }

    return newErrors;
}  