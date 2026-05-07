export class User {
    isStudent: Boolean;
    isTeacher: Boolean;
    isParent: Boolean;
    familyId: string;
    classId: string;
    classes: string[];
    families: string[];
    
    constructor(isStudent: Boolean, isTeacher: Boolean, isParent: Boolean, familyId: string, classId: string, classes: string[], families: string[]) {
        this.isStudent = isStudent;
        this.isTeacher = isTeacher;
        this.isParent = isParent;
        this.familyId = familyId;
        this.classId = classId;
        this.classes = classes;
        this.families = families;
    }

}