class Case {
    constructor({ 
        id = null, 
        title, 
        description, 
        status = 'OPEN', 
        priority = 'LOW',
        dueDate = null 
    }) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.status = status;
        this.priority = priority;
        this.dueDate = dueDate;
    }
}

export default Case;
