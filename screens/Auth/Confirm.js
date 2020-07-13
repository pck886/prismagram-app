import React, { useState } from "react";
import styled from "styled-components/native";
import { TouchableWithoutFeedback, Keyboard, Alert } from "react-native";
import AuthInput from "../../components/AuthInput";
import AuthBoutton from "../../components/AuthButton";
import useInput from "../../hooks/useInput";
import { useMutation } from "react-apollo-hooks";
import { LOG_IN, CONFIRM_SECRET } from "./AuthQueries";
import { useLogIn } from "../../AuthContext";

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const Text = styled.Text``;

export default ({ navigation }) => {
  const confirmInput = useInput("");
  const logIn = useLogIn();
  const [loading, setLoading] = useState(false);
  const confirmSecretMuation = useMutation(CONFIRM_SECRET, {
    variables: {
      secret: confirmInput.value,
      email: navigation.getParam("email"),
    },
  });

  const handleConfirm = async () => {
    const { value } = confirmInput;
    if (value === "" || !value.includes(" ")) {
      Alert.alert("정상적인 인증문자가 아닙니다.");
    }
    try {
      setLoading(true);
      const {
        data: { confirmSecret },
      } = await confirmSecretMuation();
      if (confirmSecret !== "" && confirmSecret !== false) {
        logIn(confirmSecret);
      } else {
        Alert.alert("인증문자가 틀렸습니다.");
      }
    } catch (e) {
      console.log(e);
      Alert.alert("인증을 할 수 없습니다.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View>
        <AuthInput
          {...confirmInput}
          placeholder="인증문자"
          returnKeyType="send"
          onSubmitEditing={handleConfirm}
          autoCorrect={false}
        />
        <AuthBoutton loading={loading} onPress={handleConfirm} text="인증" />
      </View>
    </TouchableWithoutFeedback>
  );
};
