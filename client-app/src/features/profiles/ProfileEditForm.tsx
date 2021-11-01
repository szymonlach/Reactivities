import { Formik, Form } from "formik";
import { observer } from "mobx-react-lite";
import React from "react";
import { Button } from "semantic-ui-react";
import MyTextArea from "../../app/common/form/MyTextArea";
import MyTextInput from "../../app/common/form/MyTextInput";
import { Profile } from "../../app/models/profile";
import { useStore } from "../../app/stores/store";
import * as Yup from 'yup';


interface Props {
    setEditMode: (editMode: boolean) => void;
    profile: Profile;
}

export default observer(function ProfileEditForm({ setEditMode, profile }: Props) {

    const { profileStore } = useStore();

    return (
        <Formik
            initialValues={{ displayName: profile.displayName, bio: profile.bio }}
            onSubmit={values => profileStore.editProfile(values).then(() => {
                setEditMode(false);
            })}
            validationSchema={Yup.object({
                displayName: Yup.string().required()
            })}
        >
            {({ handleSubmit, isSubmitting, isValid, dirty }) => (
                <Form className='ui form' onSubmit={handleSubmit}>
                    <MyTextInput name='displayName' placeholder='Edit your display name' />
                    <MyTextArea rows={3} placeholder='Edit your Bio' name='bio' />
                    <Button positive loading={isSubmitting} content='Save changes' type='submit' floated='right' disabled={!isValid || !dirty} />
                </Form>
            )}
        </Formik>
    )
})