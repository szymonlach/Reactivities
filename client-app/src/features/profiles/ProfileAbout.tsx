import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { Button, Grid, Header, Tab } from "semantic-ui-react";
import { Profile } from "../../app/models/profile";
import { useStore } from "../../app/stores/store";
import ProfileEditForm from "./ProfileEditForm";


interface Props {
    profile: Profile;
}

export default observer(function ProfileAbout({ profile }: Props) {

    const { profileStore } = useStore();
    const [editProfileMode, setEditProfileMode] = useState(false);

    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated='left' icon='user' content={`About ${profile.displayName}`} />
                    {profileStore.isCurrentUser &&
                        <Button floated='right'
                            basic
                            content={editProfileMode ? 'Cancel' : 'Edit profile'}
                            onClick={() => setEditProfileMode(!editProfileMode)}
                        />
                    }
                </Grid.Column>
                <Grid.Column width={16}>
                    {editProfileMode ? (
                        <ProfileEditForm setEditMode={setEditProfileMode} profile={profile} />
                    ) : (
                        <span style={{whiteSpace: 'pre-wrap'}}>{profile.bio}</span>
                    )}
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
})