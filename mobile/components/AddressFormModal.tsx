import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import SafeScreen from "./SafeScreen";
import { Ionicons } from "@expo/vector-icons";

interface AddressFormData {
  label: string;
  nomComplet: string;
  ville: string;
  commune: string;
  quartier: string;
  avenue: string;
  reference: string;
  numeroTelephone: string;
  isDefault: boolean;
}

interface AddressFormModalProps {
  visible: boolean;
  isEditing: boolean;
  addressForm: AddressFormData;
  isAddingAddress: boolean;
  isUpdatingAddress: boolean;
  onClose: () => void;
  onSave: () => void;
  onFormChange: (form: AddressFormData) => void;
}

const AddressFormModal = ({
  addressForm,
  isAddingAddress,
  isEditing,
  isUpdatingAddress,
  onClose,
  onFormChange,
  onSave,
  visible,
}: AddressFormModalProps) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        // className="flex-1"
      >
        <SafeScreen>
          {/* HEADER */}
          <View className="px-6 py-5 border-b border-surface flex-row items-center justify-between">
            <Text className="text-text-primary text-2xl font-bold">
              {isEditing ? "Modifier l'adresse" : "Ajouter une adresse"}
            </Text>

            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 50 }}
            showsVerticalScrollIndicator={false}
          >
            <View className="p-6">
              {/* LABEL */}
              <View className="mb-5">
                <Text className="text-text-primary font-semibold mb-2">
                  Libellé
                </Text>

                <TextInput
                  className="bg-surface text-text-primary p-4 rounded-2xl text-base"
                  placeholder="Maison, Travail..."
                  placeholderTextColor="#666"
                  value={addressForm.label}
                  onChangeText={(text) =>
                    onFormChange({
                      ...addressForm,
                      label: text,
                    })
                  }
                />
              </View>

              {/* NOM COMPLET */}
              <View className="mb-5">
                <Text className="text-text-primary font-semibold mb-2">
                  Nom complet
                </Text>

                <TextInput
                  className="bg-surface text-text-primary p-4 rounded-2xl text-base"
                  placeholder="Votre nom complet"
                  placeholderTextColor="#666"
                  value={addressForm.nomComplet}
                  onChangeText={(text) =>
                    onFormChange({
                      ...addressForm,
                      nomComplet: text,
                    })
                  }
                />
              </View>

              {/* VILLE */}
              <View className="mb-5">
                <Text className="text-text-primary font-semibold mb-2">
                  Ville
                </Text>

                <TextInput
                  className="bg-surface text-text-primary p-4 rounded-2xl text-base"
                  placeholder="ex:Kinshasa"
                  placeholderTextColor="#666"
                  value={addressForm.ville}
                  onChangeText={(text) =>
                    onFormChange({
                      ...addressForm,
                      ville: text,
                    })
                  }
                />
              </View>

              {/* COMMUNE */}
              <View className="mb-5">
                <Text className="text-text-primary font-semibold mb-2">
                  Commune
                </Text>

                <TextInput
                  className="bg-surface text-text-primary p-4 rounded-2xl text-base"
                  placeholder="ex:Gombe"
                  placeholderTextColor="#666"
                  value={addressForm.commune}
                  onChangeText={(text) =>
                    onFormChange({
                      ...addressForm,
                      commune: text,
                    })
                  }
                />
              </View>

              {/* QUARTIER */}
              <View className="mb-5">
                <Text className="text-text-primary font-semibold mb-2">
                  Quartier
                </Text>

                <TextInput
                  className="bg-surface text-text-primary p-4 rounded-2xl text-base"
                  placeholder="Votre quartier"
                  placeholderTextColor="#666"
                  value={addressForm.quartier}
                  onChangeText={(text) =>
                    onFormChange({
                      ...addressForm,
                      quartier: text,
                    })
                  }
                />
              </View>

              {/* AVENUE */}
              <View className="mb-5">
                <Text className="text-text-primary font-semibold mb-2">
                  Avenue
                </Text>

                <TextInput
                  className="bg-surface text-text-primary p-4 rounded-2xl text-base"
                  placeholder="Avenue et numéro"
                  placeholderTextColor="#666"
                  value={addressForm.avenue}
                  onChangeText={(text) =>
                    onFormChange({
                      ...addressForm,
                      avenue: text,
                    })
                  }
                />
              </View>

              {/* REFERENCE */}
              <View className="mb-5">
                <Text className="text-text-primary font-semibold mb-2">
                  Reference
                </Text>

                <TextInput
                  className="bg-surface text-text-primary p-4 rounded-2xl text-base"
                  placeholder="Indice ou nom communement connu"
                  placeholderTextColor="#666"
                  value={addressForm.reference ?? ""}
                  onChangeText={(text) =>
                    onFormChange({
                      ...addressForm,
                      reference: text,
                    })
                  }
                />
              </View>

              {/* TELEPHONE */}
              <View className="mb-5">
                <Text className="text-text-primary font-semibold mb-2">
                  Numéro de téléphone
                </Text>

                <TextInput
                  className="bg-surface text-text-primary p-4 rounded-2xl text-base"
                  placeholder="+243..."
                  placeholderTextColor="#666"
                  value={addressForm.numeroTelephone}
                  keyboardType="phone-pad"
                  onChangeText={(text) =>
                    onFormChange({
                      ...addressForm,
                      numeroTelephone: text,
                    })
                  }
                />
              </View>

              {/* DEFAULT */}
              <View className="bg-surface rounded-2xl p-4 flex-row items-center justify-between mb-6">
                <Text className="text-text-primary font-semibold">
                  Définir comme adresse par défaut
                </Text>

                <Switch
                  value={addressForm.isDefault}
                  onValueChange={(value) =>
                    onFormChange({
                      ...addressForm,
                      isDefault: value,
                    })
                  }
                  thumbColor="white"
                />
              </View>

              {/* SAVE BUTTON */}
              <TouchableOpacity
                className="bg-primary rounded-2xl py-5 items-center"
                activeOpacity={0.8}
                onPress={onSave}
                disabled={isAddingAddress || isUpdatingAddress}
              >
                {isAddingAddress || isUpdatingAddress ? (
                  <ActivityIndicator size="small" color="#121212" />
                ) : (
                  <Text className="text-background font-bold text-lg">
                    {isEditing
                      ? "Enregistrer les modifications"
                      : "Ajouter l'adresse"}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeScreen>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default AddressFormModal;

// import {
//   View,
//   Text,
//   Modal,
//   TouchableOpacity,
//   ScrollView,
//   TextInput,
//   Switch,
//   ActivityIndicator,
//   KeyboardAvoidingView,
//   Platform,
// } from "react-native";
// import SafeScreen from "./SafeScreen";
// import { Ionicons } from "@expo/vector-icons";

// interface AddressFormData {
//   label: string;
//   fullName: string;
//   streetAddress: string;
//   city: string;
//   state: string;
//   zipCode: string;
//   phoneNumber: string;
//   isDefault: boolean;
// }

// interface AddressFormModalProps {
//   visible: boolean;
//   isEditing: boolean;
//   addressForm: AddressFormData;
//   isAddingAddress: boolean;
//   isUpdatingAddress: boolean;
//   onClose: () => void;
//   onSave: () => void;
//   onFormChange: (form: AddressFormData) => void;
// }

// const AddressFormModal = ({
//   addressForm,
//   isAddingAddress,
//   isEditing,
//   isUpdatingAddress,
//   onClose,
//   onFormChange,
//   onSave,
//   visible,
// }: AddressFormModalProps) => {
//   return (
//     <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         className="flex-1"
//       >
//         <SafeScreen>
//           {/* HEADER */}
//           <View className="px-6 py-5 border-b border-surface flex-row items-center justify-between">
//             <Text className="text-text-primary text-2xl font-bold">
//               {isEditing ? "Edit Address" : "Add New Address"}
//             </Text>
//             <TouchableOpacity onPress={onClose}>
//               <Ionicons name="close" size={28} color="#FFFFFF" />
//             </TouchableOpacity>
//           </View>

//           <ScrollView
//             className="flex-1"
//             contentContainerStyle={{ paddingBottom: 50 }}
//             showsVerticalScrollIndicator={false}
//           >
//             <View className="p-6">
//               {/* LABEL INPUT */}
//               <View className="mb-5">
//                 <Text className="text-text-primary font-semibold mb-2">Label</Text>
//                 <TextInput
//                   className="bg-surface text-text-primary p-4 rounded-2xl text-base"
//                   placeholder="e.g., Home, Work, Office"
//                   placeholderTextColor="#666"
//                   value={addressForm.label}
//                   onChangeText={(text) => onFormChange({ ...addressForm, label: text })}
//                 />
//               </View>

//               {/* NAME INPUT */}
//               <View className="mb-5">
//                 <Text className="text-text-primary font-semibold mb-2">Full Name</Text>
//                 <TextInput
//                   className="bg-surface text-text-primary px-4 py-4 rounded-2xl text-base"
//                   placeholder="Enter your full name"
//                   placeholderTextColor="#666"
//                   value={addressForm.fullName}
//                   onChangeText={(text) => onFormChange({ ...addressForm, fullName: text })}
//                 />
//               </View>

//               {/* Address Input */}
//               <View className="mb-5">
//                 <Text className="text-text-primary font-semibold mb-2">Street Address</Text>
//                 <TextInput
//                   className="bg-surface text-text-primary px-4 py-4 rounded-2xl text-base"
//                   placeholder="Street address, apt/suite number"
//                   placeholderTextColor="#666"
//                   value={addressForm.streetAddress}
//                   onChangeText={(text) => onFormChange({ ...addressForm, streetAddress: text })}
//                   multiline
//                 />
//               </View>

//               {/* City Input */}
//               <View className="mb-5">
//                 <Text className="text-text-primary font-semibold mb-2">City</Text>
//                 <TextInput
//                   className="bg-surface text-text-primary px-4 py-4 rounded-2xl text-base"
//                   placeholder="e.g., New York"
//                   placeholderTextColor="#666"
//                   value={addressForm.city}
//                   onChangeText={(text) => onFormChange({ ...addressForm, city: text })}
//                 />
//               </View>

//               {/* State Input */}
//               <View className="mb-5">
//                 <Text className="text-text-primary font-semibold mb-2">State</Text>
//                 <TextInput
//                   className="bg-surface text-text-primary px-4 py-4 rounded-2xl text-base"
//                   placeholder="e.g., NY"
//                   placeholderTextColor="#666"
//                   value={addressForm.state}
//                   onChangeText={(text) => onFormChange({ ...addressForm, state: text })}
//                 />
//               </View>

//               {/* ZIP Code Input */}
//               <View className="mb-5">
//                 <Text className="text-text-primary font-semibold mb-2">ZIP Code</Text>
//                 <TextInput
//                   className="bg-surface text-text-primary px-4 py-4 rounded-2xl text-base"
//                   placeholder="e.g., 10001"
//                   placeholderTextColor="#666"
//                   value={addressForm.zipCode}
//                   onChangeText={(text) => onFormChange({ ...addressForm, zipCode: text })}
//                   keyboardType="numeric"
//                 />
//               </View>

//               {/* Phone Input */}
//               <View className="mb-5">
//                 <Text className="text-text-primary font-semibold mb-2">Phone Number</Text>
//                 <TextInput
//                   className="bg-surface text-text-primary px-4 py-4 rounded-2xl text-base"
//                   placeholder="+1 (555) 123-4567"
//                   placeholderTextColor="#666"
//                   value={addressForm.phoneNumber}
//                   onChangeText={(text) => onFormChange({ ...addressForm, phoneNumber: text })}
//                   keyboardType="phone-pad"
//                 />
//               </View>

//               {/* Default Address Toggle */}
//               <View className="bg-surface rounded-2xl p-4 flex-row items-center justify-between mb-6">
//                 <Text className="text-text-primary font-semibold">Set as default address</Text>
//                 <Switch
//                   value={addressForm.isDefault}
//                   onValueChange={(value) => onFormChange({ ...addressForm, isDefault: value })}
//                   thumbColor="white"
//                 />
//               </View>

//               {/* Save Button */}
//               <TouchableOpacity
//                 className="bg-primary rounded-2xl py-5 items-center"
//                 activeOpacity={0.8}
//                 onPress={onSave}
//                 disabled={isAddingAddress || isUpdatingAddress}
//               >
//                 {isAddingAddress || isUpdatingAddress ? (
//                   <ActivityIndicator size="small" color="#121212" />
//                 ) : (
//                   <Text className="text-background font-bold text-lg">
//                     {isEditing ? "Save Changes" : "Add Address"}
//                   </Text>
//                 )}
//               </TouchableOpacity>
//             </View>
//           </ScrollView>
//         </SafeScreen>
//       </KeyboardAvoidingView>
//     </Modal>
//   );
// };

// export default AddressFormModal;
