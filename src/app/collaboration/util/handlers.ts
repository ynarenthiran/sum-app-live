import { CollaborationService } from '../collaboration.service';
import { ValueTransformer } from '@angular/compiler/src/util';
import { CollaborationRoutingModule } from '../collaboration-routing.module';
import { map } from 'rxjs/operators';
import { ObjectTypeClass } from 'src/app/object/object.service';

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
                this.srv.updateRecord(this.collaborationId, path, record.id, result);
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

    protected createRecord(path: string, information: CreateIdentificationOptions, idField?: string) {
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
        if (information.fields) {
            var labels = {};
            input = {};
            Object.keys(information.fields).forEach((key) => {
                labels[key] = information.fields[key];
                input[key] = "";
            });
        }
        input['typeId'] = ""; // Add Type field
        labels['typeId'] = "Type";
        options.values['typeId'] = objectType$;
        this.srv.dialog.openDialog(input, options)
            .subscribe((result) => {
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
                                    this.srv.createRecord(this.collaborationId, path, result);
                                });
                        }
                        else {
                            this.srv.createRecord(this.collaborationId, path, result);
                        }
                    });
                }
                else {
                    this.srv.createRecord(this.collaborationId, path, result);
                }
            });

    }
}

export class MemberViewHandler extends ViewHandler {
    action(action: string, record?: any) {
        debugger;
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
                tags: 'Tags'
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
                    map(users => users.map(user => Object.assign({
                        value: user.id,
                        text: `${user.displayName} (${user.email})`
                    }))));
        super.createRecord('members', {
            entityTypeName: 'Member',
            fields: {
                user: users$,
                roles: 'Roles',
                tags: 'Tags'
            },
            values: {
                roles: ['Administrator', 'Contributor', 'Reader']
            },
            objectTypePath: 'memberTypes'
        });
    }
}