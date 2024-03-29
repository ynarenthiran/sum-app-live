import { CollaborationService, User } from '../collaboration.service';
import { map } from 'rxjs/operators';
import { ObjectTypeClass } from 'src/app/object/object.service';
import { NavigationEnd } from '@angular/router';

interface IdentitficationOptions {
    entityTypeName: string,
    entityName?: string
}
interface UpdateIdentificationOptions extends IdentitficationOptions {
    fields?: any;
    values?: any;
}
interface CreateIdentificationOptions extends UpdateIdentificationOptions {
    objectTypePath: string;
    template?: any;
    idField?: string;
}

abstract class DisplayObject {
    abstract toValue(): string;
}
export abstract class ViewHandler {
    collaborationId: string;

    constructor(protected srv: CollaborationService) { }

    abstract action(action: string, record?: any);

    protected updateRecord(path: string, record: any, information: UpdateIdentificationOptions) {
        var options = {
            title: `Update ${information.entityTypeName}: ${information.entityName}`,
            width: "400px",
            button: { ok: "Update", cancel: "Cancel" },
            values: information.values
        }
        var input = record;
        if (information.fields) {
            var labels = {};
            input = {};
            Object.keys(information.fields).forEach((key) => {
                labels[key] = information.fields[key];
                input[key] = record[key];
            });
        }
        this.srv.dialog.openDialog(JSON.parse(JSON.stringify(input)), options)
            .subscribe((result) => {
                const data = this.handleAdminFields(result, false);
                this.srv.updateRecord(this.collaborationId, path, record.id, data);
            });
    }

    protected removeRecord(path: string, id: string, confirmation: IdentitficationOptions) {
        this.srv.dialog.openConfirmationDialog(`Are you sure you want to remove "${confirmation.entityName}" ?`,
            {
                title: `Remove ${confirmation.entityTypeName}`,
                width: "400px",
                button: { ok: "Remove", cancel: "Cancel" }
            })
            .subscribe(() => {
                this.srv.deleteRecord(this.collaborationId, path, id);
            });
    }

    protected createRecord(path: string, information: CreateIdentificationOptions, record?: any) {
        var objectType$ =
            this.srv.objSrv.getObjectTypes(information.objectTypePath)
                .pipe(map(types => types.map(type => new ObjectTypeClass(type))));
        var options = {
            title: `Add ${information.entityTypeName}`,
            width: "400px",
            button: { ok: "Add", cancel: "Cancel" },
            values: information.values
        }
        var input = {};
        var labels = {};
        if (information.fields) {
            Object.keys(information.fields).forEach((key) => {
                labels[key] = information.fields[key];
                input[key] =
                    (information.template && information.template[key]) ? information.template[key] : ""
            });
        }
        if (record) {
            input = Object.assign(input, record);
        }
        input['typeId'] = ""; // Add Type field
        labels['typeId'] = "Type";
        if (!options.values) options.values = {};
        options.values['typeId'] = objectType$;
        options['labels'] = labels;
        this.srv.dialog.openDialog(input, options)
            .subscribe((result) => {
                if (record) {
                    result = Object.assign(record, result);
                }
                // Resolve object to fields
                Object.keys(result).forEach((key) => {
                    if (result[key].toValue) // instanceof DisplayObject doesn't work
                        result[key] = result[key].toValue();
                });
                result.typeId = result.typeId.id;
                if (result.typeId) {
                    this.srv.objSrv.getObjectType(information.objectTypePath, result.typeId).subscribe((type) => {
                        if (type.objectTypeId) {
                            this.srv.objDialogSrv.openObjectDialog(type.objectTypeId,
                                {
                                    title: `Add ${information.entityTypeName}`,
                                    width: "400px",
                                    button: { ok: "Add", cancel: "Cancel" }
                                })
                                .subscribe((attributes) => {
                                    result['attributes'] = attributes;
                                    this.setOrAddRecord(path, result, information.idField);
                                });
                        }
                        else {
                            this.setOrAddRecord(path, result, information.idField);
                        }
                    });
                }
                else {
                    this.setOrAddRecord(path, result, information.idField);
                }
            });
    }
    private setOrAddRecord(path, record, idField) {
        if (record.entries) {
            const records: any[] = record.entries;
            records.forEach((entry) => {
                this.setOrAddRecord(path, entry, idField);
            });
            return;
        }
        const data = this.handleAdminFields(record, true);
        if (idField) {
            if (record[idField]) {
                const id = record[idField];
                delete record[idField];
                this.srv.updateRecord(this.collaborationId, path, id, record);
            }
            else {
                this.srv.createRecord(this.collaborationId, path, record);
            }
        }
        else {
            this.srv.createRecord(this.collaborationId, path, record);
        }
    }
    private handleAdminFields(record: any, isCreate: boolean): any {
        if (isCreate) {
            return Object.assign(record, {
                createdByUid: this.srv.auth.currentUserId,
                createdOn: new Date(),
                //processNotification: true
            });
        }
        else {
            return Object.assign(record, {
                changedByUid: this.srv.auth.currentUserId,
                changedOn: new Date(),
                //processNotification: true
            });
        }
    }
}
/*******************************************************
 Members
 *******************************************************/
export class MemberViewHandler extends ViewHandler {
    action(action: string, record?: any) {
        switch (action) {
            case 'edit': this.editMember(record); break;
            case 'remove': this.removeMember(record); break;
            case 'fab': this.addMember(); break;
        }
    }
    private editMember(member) {
        super.updateRecord('members', member, {
            entityName: member.displayName,
            entityTypeName: 'Member',
            fields: {
                roles: 'Roles',
            },
            values: {
                roles: ['Administrator', 'Contributor', 'Reader']
            }
        });
    }
    private removeMember(member) {
        super.removeRecord('members', member.id, {
            entityName: member.displayName,
            entityTypeName: 'Member'
        });
    }
    private addMember() {
        var users$ =
            this.srv.getUsers()
                .pipe(
                    map(users => users.map(
                        user => new (class UserDisplayObject implements DisplayObject {
                            user: User;
                            constructor(user: User) { this.user = user; }
                            toString(): string { return `${this.user.displayName} (${this.user.email})`; }
                            toValue(): string { return this.user.id; }
                        })(user)
                    )));
        super.createRecord('members', {
            entityTypeName: 'Member',
            fields: {
                user: 'User',
                roles: 'Roles',
            },
            values: {
                user: users$,
                roles: ['Administrator', 'Contributor', 'Reader']
            },
            objectTypePath: 'memberTypes',
            template: { roles: [] },
            idField: 'user'
        });
    }
}
/*******************************************************
 Posts
 *******************************************************/
export class PostViewHandler extends ViewHandler {
    action(action: string, record?: any) {
        switch (action) {
            case 'send': this.postText(record); break;
        }
    }
    private postText(text) {
        const record = {
            text: text
        };
        super.createRecord('posts', {
            entityTypeName: 'Post',
            objectTypePath: 'postTypes'
        }, record);
    }
}
/*******************************************************
 Documents
 *******************************************************/
export class DocumentViewHandler extends ViewHandler {
    action(action: string, record?: any) {
        switch (action) {
            case 'addFile': this.addFiles(record); break;
            case 'addFolder': this.addFolder(record); break;
        }
    }
    private addFiles(files: any[]) {
        this.createRecord('documents', {
            entityTypeName: 'File',
            objectTypePath: 'documentTypes'
        }, { entries: files });
    }
    private addFolder(folder) {
        this.createRecord('documents', {
            entityTypeName: 'Folder',
            fields: {
                name: 'Name',
                description: 'Description'
            },
            objectTypePath: 'documentTypes'
        }, folder);
    }
}