// src/screens/TermsScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../theme/ThemeContext';

const TermsScreen = () => {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={theme.statusBarStyle} />
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Terms & Conditions</Text>

          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Introduction</Text>
          <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
            These Website Standard Terms and Conditions written on this webpage shall manage your use of our website, My Website Name accessible at https://aliffarms.com
          </Text>
          <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
            These Terms will be applied fully and affect to your use of this Website. By using this Website, you agreed to accept all terms and conditions written in here.
          </Text>
          <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
            You must not use this Website if you disagree with any of these Website Standard Terms and Conditions.
          </Text>
          <Text style={[styles.paragraph, { color: theme.colors.textSecondary, marginBottom: 16 }]}>
            Minors or people below 18 years old are not allowed to use this Website.
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Intellectual Property Rights</Text>
          <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
            Other than the content you own, under these Terms, Alif Farms and/or its licensors own all the intellectual property rights and materials contained in this Website.
          </Text>
          <Text style={[styles.paragraph, { color: theme.colors.textSecondary, marginBottom: 16 }]}>
            You are granted limited license only for purposes of viewing the material contained on this Website.
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Restrictions</Text>
          <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
            You are specifically restricted from all of the following:
          </Text>
          <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>publishing any Website material in any other media;</Text>
          <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>selling, sublicensing and/or otherwise commercializing any Website material;</Text>
          <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>publicly performing and/or showing any Website material;</Text>
          <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>using this Website in any way that is or may be damaging to this Website;</Text>
          <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>using this Website in any way that impacts user access to this Website;</Text>
          <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>using this Website contrary to applicable laws and regulations, or in any way may cause harm to the Website, or to any person or business entity;</Text>
          <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>engaging in any data mining, data harvesting, data extracting or any other similar activity in relation to this Website;</Text>
          <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>using this Website to engage in any advertising or marketing.</Text>
          <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
            Certain areas of this Website are restricted from being access by you and Alif Farms may further restrict access by you to any areas of this Website,
          </Text>
          <Text style={[styles.paragraph, { color: theme.colors.textSecondary, marginBottom: 16 }]}>
            at any time, in absolute discretion. Any user ID and password you may have for this Website are confidential and you must maintain confidentiality as well.
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Your Content</Text>
          <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
            In these Website Standard Terms and Conditions, “Your Content” shall mean any audio, video text, images or other material you choose to display on this Website. By displaying Your Content, you grant Alif Farms a non-exclusive, worldwide irrevocable, sub licensable license to use, reproduce, adapt, publish, translate and distribute it in any and all media.
          </Text>
          <Text style={[styles.paragraph, { color: theme.colors.textSecondary, marginBottom: 16 }]}>
            Your Content must be your own and must not be invading any third-party’s rights. Alif Farms reserves the right to remove any of Your Content from this Website at any time without notice.
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>No warranties</Text>
          <Text style={[styles.paragraph, { color: theme.colors.textSecondary, marginBottom: 16 }]}>
            This Website is provided “as is,” with all faults, and Alif Farms express no representations or warranties, of any kind related to this Website or the materials contained on this Website. Also, nothing contained on this Website shall be interpreted as advising you.
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Limitation of liability</Text>
          <Text style={[styles.paragraph, { color: theme.colors.textSecondary, marginBottom: 16 }]}>
            In no event shall Alif Farms, nor any of its officers, directors and employees, shall be held liable for anything arising out of or in any way connected with your use of this Website whether such liability is under contract. Alif Farms, including its officers, directors and employees shall not be held liable for any indirect, consequential or special liability arising out of or in any way related to your use of this Website.
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Indemnification</Text>
          <Text style={[styles.paragraph, { color: theme.colors.textSecondary, marginBottom: 16 }]}>
            You hereby indemnify to the fullest extent Alif Farms from and against any and/or all liabilities, costs, demands, causes of action, damages and expenses arising in any way related to your breach of any of the provisions of these Terms.
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Severability</Text>
          <Text style={[styles.paragraph, { color: theme.colors.textSecondary, marginBottom: 16 }]}>
            If any provision of these Terms is found to be invalid under any applicable law, such provisions shall be deleted without affecting the remaining provisions herein.
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Variation of Terms</Text>
          <Text style={[styles.paragraph, { color: theme.colors.textSecondary, marginBottom: 16 }]}>
            Alif Farms is permitted to revise these Terms at any time as it sees fit, and by using this Website you are expected to review these Terms on a regular basis.
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Assignment</Text>
          <Text style={[styles.paragraph, { color: theme.colors.textSecondary, marginBottom: 16 }]}>
            Alif Farms is allowed to assign, transfer, and subcontract its rights and/or obligations under these Terms without any notification. However, you are not allowed to assign, transfer, or subcontract any of your rights and/or obligations under these Terms.
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Entire Agreement</Text>
          <Text style={[styles.paragraph, { color: theme.colors.textSecondary, marginBottom: 16 }]}>
            These Terms constitute the entire agreement between Alif Farms and you in relation to your use of this Website, and supersede all prior agreements and understandings.
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Governing Law & Jurisdiction</Text>
          <Text style={[styles.paragraph, { color: theme.colors.textSecondary, marginBottom: 48 }]}>
            These Terms will be governed by and interpreted in accordance with the laws of the State of us, and you submit to the non-exclusive jurisdiction of the state and federal courts located in us for the resolution of any disputes.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  title: {
    fontSize: 28, // Adjusted for mobile (web: 3xl/5xl)
    fontWeight: '500',
    marginBottom: 24,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    fontSize: 22, // Adjusted for mobile (web: 2xl/4xl)
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  paragraph: {
    fontSize: 14, // Adjusted for mobile (web: 16px)
    lineHeight: 20,
    marginVertical: 4,
  },
});

export default TermsScreen;